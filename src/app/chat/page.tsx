"use client"
import React, { useEffect, useState } from 'react'
import { io, Socket } from "socket.io-client"

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:4000');

type Message = {
    owner:string
    text: string
}

export default function chat() {

    //const [messages, setMessages] = useState<Message[]>([])
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>("")

    useEffect(() => {
        socket.on("connect", () => {
            console.log("🔌 Conectado al servidor con ID:", socket.id);
        });

        socket.emit("join", "1")

        socket.on("basicEmit", (id, data) => {
            console.log(id)
            console.log(data)
            setMessages((prev) => [...prev, data]);
        });

        // Limpiar el listener al desmontar
        return () => {
            socket.off("basicEmit");
        };
    }, [])


    function handleSubmit() {
        if (input.trim() !== "") {
            socket.emit("message", input)
            setInput("")
        }
    }

    return (
        <div className='w-full h-full'>
            <p>Chat</p>
            <div className='w-full h-[40rem] p-8 flex flex-col mb-4 border text-black border-gray-600 bg-gray-800/50 rounded-lg'>
                {messages.map((item: any, ident: number) => (
                    <div key={ident} className='bg-white w-64 rounded rounded-lg p-2 mb-6'>
                        <b className='text-green-500'>Tu:</b>
                        <p>{item}</p>
                    </div>
                ))}
                {messages.length == 0 &&
                    <div className='flex flex-col text-center justify-center w-full h-full text-gray-400'>
                        <p>(－_－) zzZ</p>
                        <p>Nothing to check here by now</p>
                    </div>
                }

            </div>
            <div>
                <input type="text" name="message" id="message" className='p-3 outline-none w-96 bg-zinc-800 mr-6' placeholder='Input a message' onChange={(e) => setInput(e.target.value)} value={input} />
                <button onClick={handleSubmit}
                    className='text-lg text-white px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-500 hover:to-lime-600 transition duration-300'>Send</button>
            </div>
        </div>
    )
}