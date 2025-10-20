"use client";
import getChatRoomById from "@/actions/getChatRoomById";
import getSessionUser from "@/actions/getSessionUser";
import insertChatMessage from "@/actions/insertChatMessage";
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
  const [user, setUser] = useState<User>()

  useEffect(() => {

    socket.on("connect", () => {
      console.log("🔌 Conectado al servidor con ID:", socket.id);
    });

    const getSessionUserId = async () => {
      const user: User = await getSessionUser()
      setUser(user)

      let messageRows: Message[] = await getChatRoomById(roomId) as Message[]
      setMessages(messageRows)

      console.log('Room id: ' + roomId)
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
        senderId: user?.user_id,
        senderName: user?.user_name,
        text: input,
        created_at: Date.now(),
      });

      // Insert the message in the database
      insertChatMessage(roomId, user?.user_id, user?.user_name, input)
      setInput("");
    }
  }

  return (
    <div className="flex space-x-8 w-full h-full">
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
      <div className="w-3/4 h-[40rem]">
        <div className="w-full h-full flex flex-col overflow-scroll no-scrollbar mb-4 p-8 border border-gray-600 text-black bg-gray-800/50 rounded-lg">
          {messages.map((item: any, ident: number) => (
            <div className="w-full mb-6" key={ident}>
              <div className={`bg-white w-64 rounded rounded-lg p-2 ${item.senderId != user?.user_id && 'float-right'}`}>
                <b className={`text-green-500 ${item.senderId != user?.user_id && 'text-purple-500'}`}>{item.senderName}</b>
                <p>{item.text}</p>
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
