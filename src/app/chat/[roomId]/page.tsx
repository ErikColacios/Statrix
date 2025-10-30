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
  const [typingUser, setTypingUser] = useState<string | undefined>('')

  useEffect(() => {

    socket.on("connect", () => {
      console.log("🔌 Connected to the server with ID:", socket.id);
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


    // Receiving when the other user is typing
    socket.on("typing", (messageData) => {
      const typingData = {
        roomId: roomId,
        senderId: messageData.senderId?.toString(),
        senderName: messageData.senderName?.toString(),
      };
      
      setTypingUser(typingData.senderName)
      document.getElementById('typing')?.classList.remove('hidden')
      scrollToBottom()

      // We hide the typing message after 5 seconds
      setTimeout(() => {
          document.getElementById('typing')?.classList.add('hidden')
      }, 5000);
    });



    // Receive message from the WS server
    socket.on("basicEmit", (id, messageData) => {
      const message: Message = {
        senderId: messageData.senderId?.toString(),
        senderName: messageData.senderName?.toString(),
        text: messageData.text.toString(),
        created_at: Date.now(),
      };
      setMessages((prev) => [...prev, message])
      setTypingUser('')
    });

    getSessionUserId()

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


  function handleTyping(input:string) {
    setInput(input)
    
    if(input !== '')
      socket.emit("typing", {
        roomId: roomId,
        senderId: sessionUser?.user_id,
        senderName: sessionUser?.user_name,
      });
  }

  
  // Send a message to te WS server
  function handleSubmit(e: FormEvent) {
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
    <div className="flex h-full w-full md:w-1/2">
      <div className="w-full h-[40rem] text-white">
        <div className="w-full h-full flex flex-col mb-4 border border-gray-600 rounded-e-2xl overflow-hidden">

          {/* Friend info */}
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

{         /* Messages */}
          <div className="w-full h-full flex flex-col overflow-scroll no-scrollbar p-4">
            {messages.map((message: any, messageIdent: number) => (
              // Message
              <div className="w-full" key={messageIdent}>
                <div className={`border bg-zinc-800 w-64 rounded mb-4 p-2 ${message.senderId != sessionUser?.user_id
                  ? 'border-zinc-600 rounded-e-2xl rounded-es-2xl'
                  : 'border-green-600 rounded-s-2xl rounded-br-2xl float-right'}`}>
                  <b>{message.senderName}</b>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}

            {/* Typing */}
            {typingUser !== sessionUser?.user_name && typingUser !== '' && <p className="animate-pulse p-1 w-full hidden text-gray-300" id="typing">{typingUser} is typing...</p>}
            
            {/* This div indicates the end of the chat */}
            <div ref={messagesEndRef} />

            {messages.length == 0 && (
              <div className="flex flex-col text-center justify-center w-full h-full text-gray-400">
                <p>(๑'ᵕ'๑)⸝*</p>
                <p>Be the first to start a conversation!</p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full"> 
          <form className="relative flex" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              name="message"
              id="message"
              className="w-full p-3 outline-none bg-zinc-800 rounded-xl"
              placeholder="Type a message"
              onChange={(e) => handleTyping(e.target.value)}
              value={input}
            />
            <button className="absolute right-0 h-full px-4 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300" type="submit">
              <svg fill="#ffffff" width="23px" height="23px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>send</title> <path d="M0 16l12 4 4 12 16-32zM14.016 18.016l12-12-10.016 17.984z"></path> </g></svg>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
