"use client"
import getChatMessages from "@/actions/getChatMessages";
import getChatRoomById from "@/actions/getChatRoomById";
import getSessionUser from "@/actions/getSessionUser";
import getUserInfo from "@/actions/getUserInfo";
import insertChatMessage from "@/actions/insertChatMessage";
import LoadingAnimation from "@/components/LoadingAnimation";
import Link from "next/link";
import React, { useState, useEffect, FormEvent, useRef, useCallback } from "react";
import { Socket, io } from "socket.io-client";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({ path: "/socket.io"});

export default function Chat({ params }: { params: { roomId: string } }) {

  const [roomId, setRoomId] = useState<string>(params.roomId);
  const [roomInfo, setRoomInfo] = useState([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [sessionUser, setSessionUser] = useState<User>()
  const [friendUser, setFriendUser] = useState([])
  const [typingUser, setTypingUser] = useState<string | undefined>('')

  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesTopRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null)
  const isLoading = useRef(false);
  const offsetRef = useRef(0);
  const scrollBottomButton = useRef<HTMLButtonElement | null>(null)


  const lastMessageRef = useCallback((node: any) => {
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(async entries => {
      const firstEntry = entries[0];

      if (firstEntry.isIntersecting && hasMoreMessages && !isLoading.current) {
        
        isLoading.current = true;

        const newOffset = offsetRef.current + 25;

        const messageRowsFromOffset: Message[] = await getChatMessages(roomId, newOffset) as Message[]

        if(messageRowsFromOffset.length === 0){
          setHasMoreMessages(false)
        } else {
          offsetRef.current = newOffset;
          setMessages(prev => [...prev, ...messageRowsFromOffset]);
        }

        setTimeout(() => (isLoading.current = false), 500);
      }
    })
    if (node) observer.current.observe(node)

  }, [/*messages,*/ hasMoreMessages, roomId]);


  useEffect(() => {

    socket.on("connect", () => {
      console.log("🔌 Connected to the server with ID:", socket.id);
    });

    const getSessionUserId = async () => {
      const session = await getSessionUser()
      setSessionUser({userId: session.user.id, userName: session.user.name})

      const chatRoomInfo = await getChatRoomById(roomId)
      setRoomInfo(chatRoomInfo)

      const messageRows: Message[] = await getChatMessages(roomId, 0) as Message[]
      setMessages(messageRows)

      const room = chatRoomInfo?.[0];
      if (!room) return;

      let otherUser: any | undefined = []

      if (String(session?.user.id) === String(room.user1_id)) {
        otherUser = await getUserInfo(chatRoomInfo[0].user2_name)
        setFriendUser(otherUser)
      } else {
        otherUser = await getUserInfo(chatRoomInfo[0].user1_name)
        setFriendUser(otherUser)
      }

      // Join to the room with the roomId
      socket.emit("joinRoom", roomId);

      // Scroll to the bottom of the chat
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
      // setTimeout(() => {
      //     document.getElementById('typing')?.classList.add('hidden')
      // }, 5000);
    });



    // Receive message from the WS server
    socket.on("basicEmit", (id, messageData) => {
      const message: Message = {
        messageId: messageData.messageId,
        senderId: messageData.senderId?.toString(),
        senderName: messageData.senderName?.toString(),
        text: messageData.text.toString(),
        created_at: messageData.created_at.toString()
      };
      setMessages((prev) => [message, ...prev])
      setTypingUser('')
    });

    getSessionUserId()


    return () => {
      socket.off("basicEmit");
    };
  },[]);


  // Detects the scroll position (Y) of the chat container and hides or shows the Scroll Bottom button.
  async function handleScrollChat() {

    if (messagesTopRef.current?.scroll) {
      if(scrollBottomButton.current?.classList.contains('hidden')){
        scrollBottomButton.current?.classList.remove('hidden')
      }

      if(messagesTopRef.current?.scrollTop === 0){
        scrollBottomButton.current?.classList.add('hidden')
      }
    }
  }


  // Auto scrolls to the bottom of the chat
  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  // Triggers when the user starts typing a message. It emmits a 'typing' event
  function handleTyping(input: string) {
    setInput(input)

    if (input !== '')
      socket.emit("typing", {
        roomId: roomId,
        senderId: sessionUser?.userId,
        senderName: sessionUser?.userName,
      });
  }


  // Send a message to te WS server
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (input.trim() !== "") {
      socket.emit("messageData", {
        roomId: roomId,
        senderId: sessionUser?.userId,
        senderName: sessionUser?.userName,
        text: input,
        created_at: new Date().toLocaleDateString(),
      });
      
      // Insert the message in the database
      insertChatMessage(roomId, sessionUser?.userId, sessionUser?.userName, input)
      setInput("");
    }
  }


  return (
    <div className="flex w-full md:w-1/2 h-6/7">
      <div className="relative w-full h-full flex flex-col rounded-2xl sm:rounded-none sm:rounded-e-2xl border border-white/10 sm:border-l-0 bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        {/* Friend info */}
        {friendUser.map((friend: any, friendIdent: number) => (
          <div className="w-full flex items-center px-4 sm:px-5 py-3 border-b border-white/10 bg-white/[0.03]" key={friendIdent}>
            <Link href={`/profile/${friend.user_name}`} className="group flex items-center gap-3 min-w-0">
              <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/10 transition group-hover:ring-green-500/60">
                <img src={friend.user_avatar ? `https://media.statrix.app/avatars/${friend.user_id}/${friend.user_avatar}` : "/avatarImages/avatar_default.jpg"} className="h-full w-full object-cover" alt="Avatar image"/>
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate transition group-hover:text-green-400">{friend.user_name}</p>
                <p className="text-xs text-zinc-400">View profile</p>
              </div>
            </Link>
          </div>
        ))}

        {/* Messages */}
        <div className="relative flex-1 min-h-0">
          <div className="w-full h-full flex flex-col-reverse overflow-y-auto no-scrollbar p-4 sm:p-6" ref={messagesTopRef} onScroll={handleScrollChat}>

            {/* This div indicates the end of the chat */}
            <div ref={messagesEndRef} />

            {/* Typing */}
            {typingUser !== sessionUser?.userName && typingUser !== '' &&
              <p className="hidden w-fit mt-1 px-3 py-2 rounded-2xl rounded-es-md bg-white/5 border border-white/10 text-xs text-zinc-300 animate-pulse" id="typing">{typingUser} is typing...</p>}

            {messages.map((message: any, messageIdent: number) => {
              const isOwnMessage: boolean = message.senderId == sessionUser?.userId
              return (
                <div className={`w-full flex mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`} key={messageIdent} ref={messageIdent === messages.length - 1 ? lastMessageRef : null}>
                  <div className={`max-w-[80%] sm:max-w-sm px-4 py-2.5 border shadow-sm ${isOwnMessage
                    ? 'bg-green-600/20 border-green-500/30 rounded-2xl rounded-br-md'
                    : 'bg-white/5 border-white/10 rounded-2xl rounded-es-md'}`}>
                    <div className="flex items-baseline gap-3">
                      <p className={`text-xs font-semibold ${isOwnMessage ? "text-green-300" : "text-zinc-200"}`}>{message.senderName}</p>
                      <p className="ml-auto text-[11px] text-zinc-500">{message.created_at.toString()}</p>
                    </div>
                    <p className="mt-0.5 break-words">{message.text}</p>
                  </div>
                </div>
              )
            })}

            {messages.length == 0 && (
              <div className="flex flex-col items-center justify-center gap-3 text-center w-full h-full text-zinc-400">
                <p>Be the first to start a conversation!</p>
              </div>
            )}
            {isLoading && hasMoreMessages && <LoadingAnimation/>}

          </div>

          <button ref={scrollBottomButton} aria-label="Scroll to bottom" className="hidden absolute bottom-3 right-3 p-2 rounded-full bg-zinc-800/90 backdrop-blur-sm border border-white/10 text-zinc-300 shadow-lg transition hover:text-white hover:bg-zinc-700/90" onClick={scrollToBottom}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 6 5 5 5-5" /><path d="m7 13 5 5 5-5" /></svg>
          </button>
        </div>

        {/* Message input */}
        <div className="w-full p-3 sm:p-4 border-t border-white/10 bg-white/[0.03]">
          <form className="flex items-center gap-2" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              name="message"
              id="message"
              className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-hidden placeholder:text-zinc-500 transition focus:border-green-500 focus:bg-white/10"
              placeholder="Type a message"
              onChange={(e) => handleTyping(e.target.value)}
              value={input}
              autoComplete="off"
            />
            <button aria-label="Send message" className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
