"use client";
import getChatMessages from "@/actions/getChatMessages";
import getChatRoomById from "@/actions/getChatRoomById";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import insertChatMessage from "@/actions/insertChatMessage";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000"
);

export default function Chat({ params }: { params: { roomId: string } }) {

  const [roomId, setRoomId] = useState<string>(params.roomId);
  const [roomInfo, setRoomInfo] = useState([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [sessionUser, setSessionUser] = useState<User>()
  const [friendUser, setFriendUser] = useState([])

  useEffect(() => {

    socket.on("connect", () => {
      console.log("🔌 Conectado al servidor con ID:", socket.id);
    });

    const getSessionUserId = async () => {
      const user: User = await getSessionUser()
      setSessionUser(user)

      const chatRoomInfo = await getChatRoomById(roomId)
      setRoomInfo(chatRoomInfo)

      const messageRows: Message[] = await getChatMessages(roomId) as Message[]
      setMessages(messageRows)


      const room = chatRoomInfo?.[0];
      if (!room) return;

      // Guess the other friend's userId and userName (must be the different one from the session user)
      // if (String(user?.user_id) === String(room.user1_id)) {
      //   setFriendUser({
      //     user_id: chatRoomInfo[0].user2_id,
      //     user_name: chatRoomInfo[0].user2_name,
      //   });
      // } else {
      //   setFriendUser({
      //     user_id: chatRoomInfo[0].user1_id,
      //     user_name: chatRoomInfo[0].user1_name,
      //   });
      // }

      let otherUser: any | undefined = []

      if (String(user?.user_id) === String(room.user1_id)) {
        otherUser = await getUserInfo(chatRoomInfo[0].user2_name)
        setFriendUser(otherUser)
      } else {
        otherUser = await getUserInfo(chatRoomInfo[0].user1_name)
        setFriendUser(otherUser)
      }
      console.log(otherUser)

      // We join to the room with the roomId
      socket.emit("joinRoom", roomId);
    }
    getSessionUserId()


    // Receive message from the WS server
    socket.on("basicEmit", (id, messageData) => {
      const message: Message = {
        senderId: messageData.senderId?.toString(),
        senderName: messageData.senderName?.toString(),
        text: messageData.text.toString(),
        created_at: Date.now(),
      };
      setMessages((prev) => [...prev, message])
      console.log(messages)
    });


    return () => {
      socket.off("basicEmit");
    };
  }, []);

  // Send a message to te WS server
  function handleSubmit() {
    if (input.trim() !== "") {
      socket.emit("messageData", {
        roomId: roomId,
        senderId: sessionUser?.user_id,
        senderName: sessionUser?.user_name,
        text: input,
        created_at: Date.now(),
      });

      // Insert the message in the database
      insertChatMessage(roomId, sessionUser?.user_id, sessionUser?.user_name, input)
      setInput("");
    }
  }

  return (
    <div className="flex justify-center space-x-8 w-full h-full">
      <aside className="w-1/4 flex flex-col text-white bg-zinc-900 p-4 border border-gray-600 rounded-lg">
        <h2 className="text-3xl font-bold mb-8">Chat Rooms</h2>
        <div className="p-2 mb-2 hover:bg-zinc-700 rounded">
          Edwin
          <p className="text-sm text-gray-300">Last online: 27-09-2025</p>
        </div>
        <div className="p-2 mb-2 hover:bg-zinc-700 rounded">
          Mar
          <p className="text-sm text-gray-300">Last online: 30-09-2025</p>
        </div>
      </aside>
      <div className="w-2/4 h-[40rem] text-white">
        <div className="w-full h-full flex flex-col overflow-scroll no-scrollbar mb-4 border border-gray-600 rounded-lg">

          {friendUser.map((friend: any, friendIdent: number) => (
            <div className="w-full bg-zinc-900 text-xl p-4" key={friendIdent}>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded rounded-full overflow-hidden">
                  <img src={`/avatarImages/${friend.avatar_image}`} className="h-full w-full object-cover" />
                </div>
                <Link href={`/profile/${friend.user_name}`} className="text-white ml-4 hover:text-green-500">{friend.user_name}</Link>
              </div>
            </div>
          ))}

          <div className="w-full h-full flex flex-col p-4">
            {messages.map((message: any, messageIdent: number) => (
              // Message
              <div className="w-full mb-6" key={messageIdent}>
                <div className={`border bg-zinc-800 w-64 rounded p-2 ${message.senderId != sessionUser?.user_id
                  ? 'border-zinc-600 rounded-e-2xl rounded-es-2xl'
                  : 'border-green-600 rounded-s-2xl rounded-br-2xl float-right'}`}>
                  <b>{message.senderName}</b>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {messages.length == 0 && (
              <div className="flex flex-col text-center justify-center w-full h-full text-gray-400">
                <p>(๑'ᵕ'๑)⸝*</p>
                <p>Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <input
            type="text"
            name="message"
            id="message"
            className="p-3 outline-none w-96 bg-zinc-800 mr-6"
            placeholder="Input a message"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <button
            onClick={handleSubmit}
            className="text-lg text-white px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
