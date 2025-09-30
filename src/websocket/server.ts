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
  console.log(`✅ Cliente conectado: ${socket.id}`);

  socket.on('join', async (roomId: string) => {
    await socket.join(roomId);
  });

  socket.on('leave', async (roomId: string) => {
    await socket.leave(roomId);
  });

  socket.on('message', (data:string) => {
    console.log(data);
    io.to("1").emit("basicEmit", 1, data, Buffer.from([3]));
  });


  socket.on('disconnect', () => console.log(`❌ Cliente desconectado: ${socket.id}`));
});



server.listen(PORT, () => {
  console.log("Chat server running on port 4000");
});