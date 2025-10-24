"use client";
import getChatMessages from "@/actions/getChatMessages";
import getChatRoomById from "@/actions/getChatRoomById";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import insertChatMessage from "@/actions/insertChatMessage";
import Link from "next/link";
import React, { useState, useEffect, FormEvent, useRef } from "react";
import { Socket, io } from "socket.io-client";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:4000"
);

export default function Chat({ params }: { params: { roomId: string } }) {

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
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

      let otherUser: any | undefined = []

      if (String(user?.user_id) === String(room.user1_id)) {
        otherUser = await getUserInfo(chatRoomInfo[0].user2_name)
        setFriendUser(otherUser)
      } else {
        otherUser = await getUserInfo(chatRoomInfo[0].user1_name)
        setFriendUser(otherUser)
      }

      // We join to the room with the roomId
      socket.emit("joinRoom", roomId);

      // We scroll to the bottom of the chat
      scrollToBottom()
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


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a message to te WS server
  function handleSubmit(e:FormEvent) {
    e.preventDefault()
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
    <div className="flex w-full h-full">
      <div className="w-2/4 h-[40rem] text-white">
        <div className="w-full h-full flex flex-col mb-4 border border-gray-600 rounded-lg">

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

          <div className="w-full h-full flex flex-col overflow-scroll no-scrollbar p-4">
            {messages.map((message: any, messageIdent: number) => (
              // Message
              <div className="w-full mb-6" key={messageIdent}>
                <div className={`border bg-zinc-800 w-64 rounded p-2 ${message.senderId != sessionUser?.user_id
                  ? 'border-zinc-600 rounded-e-2xl rounded-es-2xl'
                  : 'border-green-600 rounded-s-2xl rounded-br-2xl float-right'}`}>
                  <b>{message.senderName}</b>
                  <p>{message.text}</p>
                </div>
                <div ref={messagesEndRef} />
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

        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            name="message"
            id="message"
            className="p-3 outline-none w-full bg-zinc-800 mr-6"
            placeholder="Type a message"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </form>
      </div>
    </div>
  );
}
