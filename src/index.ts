import  express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors:{
    origin:"http://localhost:3000",
    methods:["GET","POST"],
    credentials:true
} });

io.on("connection", (socket) => {
//   console.log(socket.id);
  
  socket.on("joinChat", async (userId1,userId2) =>{
    const roomId = userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`;

    socket.join(roomId);
    console.log("User Joined "+socket.id+" socket and room "+roomId);
    
  })
  socket.on("sendMessage", (userId1,userId2,data) => {
    console.log("send message ",data);
    const roomId = userId1 < userId2 ? `${userId1}-${userId2}` : `${userId2}-${userId1}`;
    const message = {
        content: data,
        senderId: userId2, // This can be the ID of the user sending the message
        timestamp: Date.now(),
      };
    io.to(roomId).emit("sendMessage", {
        content: data,
        senderId: userId2, // This can be the ID of the user sending the message
        timestamp: Date.now(),
    });
  });
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
});
});

httpServer.listen(3001);