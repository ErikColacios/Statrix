// import express from 'express';
// import { createServer } from 'http';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
// import { Server } from 'socket.io';

import { Server } from "socket.io";

// const app = express()
// const server = createServer(app)
// const io = new Server(server) // The ws server is ON

// const __dirname = dirname(fileURLToPath(import.meta.url))

// // app.get('/chat', (req, res) => {
// //     res.sendFile(join(__dirname, ''))
// // })

// io.on('connection', (socket) => {
//     console.log('User connected')
// })

// server.listen(4000, () => {
//     console.log('Chat server running on port 4000')
// })

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>();

io.on("connection", (socket) => {
  socket.emit("noArg");
  socket.emit("basicEmit", 1, "2", Buffer.from([3]));
  socket.emit("withAck", "4", (e) => {
    // e is inferred as number
  });

  // works when broadcast to all
  io.emit("noArg");

  // works when broadcasting to a room
  io.to("room1").emit("basicEmit", 1, "2", Buffer.from([3]));
});