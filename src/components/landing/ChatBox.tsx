import React from "react"

export default function ChatBox({ messages }: any) {

    return (
        <div className="sm:w-96 h-160" key={0}>
            <div className="relative w-full h-full flex flex-col rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl overflow-hidden shadow-2xl">
                {/* Friend info */}
                <div className="w-full flex items-center px-4 sm:px-5 py-3 border-b border-white/10 bg-white/[0.03]">
                    <div className="group flex items-center gap-3 min-w-0 cursor-pointer">
                        <div className="shrink-0 w-11 h-11 rounded-full overflow-hidden ring-2 ring-white/10 transition group-hover:ring-green-500/60">
                            <img src={messages[1].avatarImage} className="h-full w-full object-cover" alt="Avatar image" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-semibold text-white truncate transition group-hover:text-green-400">{messages[0].senderName}</p>
                            <p className="text-xs text-zinc-400">View profile</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="relative flex-1 min-h-0">
                    <div className="w-full h-full flex flex-col-reverse overflow-y-auto no-scrollbar p-4 sm:p-6">
                        {messages.map((message: any, ident: number) => {
                            const isOwnMessage: boolean = message.senderId == 1
                            return (
                                <div className={`w-full flex mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`} key={ident}>
                                    <div className={`max-w-[80%] sm:max-w-sm px-4 py-2.5 border shadow-sm text-white ${isOwnMessage
                                        ? 'bg-green-600/20 border-green-500/30 rounded-2xl rounded-br-md'
                                        : 'bg-white/5 border-white/10 rounded-2xl rounded-es-md'}`}>
                                        <div className="flex items-baseline gap-3">
                                            <p className={`text-xs ${isOwnMessage ? "text-green-300" : "text-zinc-200"}`}>{message.senderName}</p>
                                            <p className="ml-auto text-[11px] text-zinc-500">{message.createdAt.toString()}</p>
                                        </div>
                                        <p className="mt-0.5 break-words">{message.text}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Message input */}
                <div className="w-full p-3 sm:p-4 border-t border-white/10 bg-white/[0.03]">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            name="message"
                            id="message"
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white outline-hidden placeholder:text-zinc-500 transition focus:border-green-500 focus:bg-white/10"
                            placeholder="Type a message"
                            autoComplete="off"
                        />
                        <button aria-label="Send message" className="shrink-0 flex items-center justify-center w-12 h-12 rounded-xl text-white bg-linear-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 shadow-lg shadow-green-900/40 transition duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
