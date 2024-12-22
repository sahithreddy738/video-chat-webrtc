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
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, () => console.log("Server started at port 8000"));
