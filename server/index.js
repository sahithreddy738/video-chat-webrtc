import bodyParser from "body-parser";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const app = new express();
const server = createServer(app);
const io = new Server(server, { cors: true });

app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log("User Connected to " + socket.id);
  
  socket.on("join:room",({email,roomId})=>{
    console.log(`User ${email} Joined to ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit("user:joined",{id:socket.id,email})
    io.to(socket.id).emit("join:room",{email,roomId});
  })

  socket.on("user:call",({to,offer})=>{
    console.log("Received offer from "+socket.id);
    io.to(to).emit("incoming:call",{from:socket.id,offer});
  })

  socket.on("call:accepted",({to,ans})=>{
    console.log("Call accepted from"+socket.id);
    io.to(to).emit("call:accepted",{from:socket.id,ans});
  })

  socket.on("negotiation:needed",({to,offer})=> {
    console.log("Received negotiation offer from "+socket.id);
    io.to(to).emit("negotiation:call",{from:socket.id,offer});
  })
  socket.on("negotiation:accepted",({to,ans})=>{
    console.log("negotiation accepted from"+socket.id);
    io.to(to).emit("negotiation:final",{from:socket.id,ans});
  })
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, () => console.log("Server started at port 8000"));
