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

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "/chat/"
);

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
    <div className="flex w-full md:w-1/2 h-5/6">
      <div className="w-full ">
        <div className="relative w-full h-full flex flex-col mb-4 border border-gray-600 rounded-2xl sm:rounded-none sm:rounded-e-2xl overflow-hidden">
          {/* Friend info */}
          {friendUser.map((friend: any, friendIdent: number) => (
            <div className="w-full bg-zinc-900 border-b border-gray-600 text-xl p-4" key={friendIdent}>
              <Link href={`/profile/${friend.user_name}`}>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src={`/avatarImages/${friend.avatar_image}`} className="h-full w-full object-cover" alt="Avatar image"/>
                </div>
                <p className="text-white ml-4 hover:text-green-500">{friend.user_name}</p>
              </div>
              </Link>
            </div>
          ))}

          {/* Messages */}
          <div className="w-full h-full flex flex-col flex-col-reverse overflow-scroll no-scrollbar bg-zinc-900 p-4" ref={messagesTopRef} onScroll={handleScrollChat}>

            {/* This div indicates the end of the chat */}
            <div ref={messagesEndRef} />

            {/* Typing */}
            {typingUser !== sessionUser?.userName && typingUser !== '' && <p className="animate-pulse p-1 w-full hidden text-gray-300" id="typing">{typingUser} is typing...</p>}

            {messages.map((message: any, messageIdent: number) => (
                  <div className="w-full" key={messageIdent} ref={messageIdent === messages.length - 1 ? lastMessageRef : null}>
                    <div className={`border bg-zinc-800 w-64 rounded mb-4 p-2 ${message.senderId != sessionUser?.userId
                      ? 'border-zinc-600 rounded-e-2xl rounded-es-2xl'
                      : 'border-green-600 rounded-s-2xl rounded-br-2xl float-right'}`}>
                      {/* <b className="mr-4">{message.messageId}</b> */}
                      <div className="flex items-center">
                        <b>{message.senderName}</b>
                        {/* <p className="text-xs text-gray-400 ml-4">{message?.created_at.toLocaleDateString()+' ' + message?.created_at.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}</p> */}
                        <p className="text-xs text-gray-400 ml-4">{message.created_at.toString()}</p>

                      </div>
                      <p>{message.text}</p>
                    </div>
                  </div>
            ))}

            {messages.length == 0 && (
              <div className="flex flex-col text-center justify-center w-full h-full text-gray-400">
                {/* <p>(๑'ᵕ'๑)⸝*</p> */}
                <p>Be the first to start a conversation!</p>
              </div>
            )}
            {isLoading && hasMoreMessages && <LoadingAnimation/>}

          </div>

          <button ref={scrollBottomButton} className="hidden absolute bottom-3 right-3 rounded-full bg-zinc-700/80 hover:bg-zinc-600/80 border border-gray-600" onClick={scrollToBottom}>
            <svg width="42px" height="42px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12.0006 10.9409L9.53062 8.46979L8.46973 9.53021L12.0006 13.0626L15.5315 9.53021L14.4706 8.46979L12.0006 10.9409Z" fill="#b0b0b0"></path> <path fillRule="evenodd" clipRule="evenodd" d="M12.0006 14.9409L9.53062 12.4698L8.46973 13.5302L12.0006 17.0626L15.5315 13.5302L14.4706 12.4698L12.0006 14.9409Z" fill="#b0b0b0"></path> </g></svg>
          </button>
        </div>

        <div className="w-full">
          <form className="relative flex" onSubmit={(e) => handleSubmit(e)}>
            <input
              type="text"
              name="message"
              id="message"
              className="w-full p-3 outline-hidden bg-zinc-800 rounded-xl"
              placeholder="Type a message"
              onChange={(e) => handleTyping(e.target.value)}
              value={input}
            />
            <button className="absolute right-0 h-full px-4 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300" type="submit">
              <svg fill="#ffffff" width="23px" height="23px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>send</title> <path d="M0 16l12 4 4 12 16-32zM14.016 18.016l12-12-10.016 17.984z"></path> </g></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}