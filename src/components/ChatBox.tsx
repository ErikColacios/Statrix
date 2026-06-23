import React from "react"

export default function ChatBox({ messages }: any) {

    return (
        <div className="sm:w-96 h-160" key={0}>
            <div className="relative w-full h-full flex flex-col mb-4 border border-gray-600 rounded-2xl overflow-hidden">
                <div className="w-full bg-zinc-900 border-b border-gray-600 text-xl p-4" >
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-sm rounded-full overflow-hidden">
                            <img src={messages[1].avatarImage} className="h-full w-full object-cover" alt="Avatar image" />
                        </div>
                        <button className="text-white ml-4 hover:text-green-500">{messages[0].senderName}</button>
                    </div>
                </div>
                <div className="w-full h-full flex flex-col flex-col-reverse overflow-scroll no-scrollbar bg-zinc-900 p-4" >
                    {messages.map((message: any, ident: number) => (
                        <div className="w-full" key={ident}>
                            <div className={`border bg-zinc-800 w-64 rounded mb-4 p-2 ${message.senderId != 1
                                ? 'border-zinc-600 rounded-e-2xl rounded-es-2xl'
                                : 'border-green-600 rounded-s-2xl rounded-br-2xl float-right'}`}>
                                <div className="flex items-center">
                                    <b>{message.senderName}</b>
                                    <p className="text-xs text-gray-400 ml-4">{message.createdAt.toString()}</p>
                                </div>
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full">
                <div className="relative flex">
                    <input
                        type="text"
                        name="message"
                        id="message"
                        className="w-full p-3 outline-hidden bg-zinc-800 rounded-xl"
                        placeholder="Type a message"
                    />
                    <button className="absolute right-0 h-full px-4 rounded-xl bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300">
                        <svg fill="#ffffff" width="23px" height="23px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>send</title> <path d="M0 16l12 4 4 12 16-32zM14.016 18.016l12-12-10.016 17.984z"></path> </g></svg>
                    </button>
                </div>
            </div>
        </div>
    )
}