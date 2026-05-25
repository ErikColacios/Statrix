import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

const PORT = process.env.PORT || 4000;
const app = express();
const server = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket:Socket) => {
  socket.on('joinRoom', async (roomId: string) => {
    console.log('Joined room: ' + roomId)
    await socket.join(roomId);
  });

  socket.on('leaveRoom', async (roomId: string) => {
    await socket.leave(roomId);
  });

  // Typing
  socket.on('typing', (messageData:{messageId:number, roomId: string; senderId:string | undefined, senderName:string | undefined}) => {
    io.to(messageData.roomId).emit("typing", messageData, Buffer.from([3]));
  });

  socket.on('messageData', (messageData:{messageId:number, roomId: string; senderId:string | undefined, senderName:string | undefined, text: string; created_at: Date, avatar_image_id:string }) => {
    io.to(messageData.roomId).emit("basicEmit", 1, messageData, Buffer.from([3]));
  });


  socket.on('disconnect', () => console.log(`❌ Client disconnected: ${socket.id}`));
});


server.listen(PORT, () => {
  console.log("Chat server running on port 4000");
});