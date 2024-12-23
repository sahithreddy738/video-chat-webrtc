import React, { useCallback, useEffect, useState } from "react";
import Input from "../components/input";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../providers/socket";

const HomePage = () => {
  const [email, setEmail] = useState();
  const [roomId, setRoomId] = useState();
  const navigate = useNavigate();
  const socket = useSocket();
  const handleButtonClick = () => {
    socket.emit("join:room", { email, roomId });
  };
  const handleRoomJoin = useCallback(
    ({ email, roomId }) => {
      navigate(`/room/${roomId}`);
    },
    [roomId]
  );
  useEffect(() => {
    socket.on("join:room", handleRoomJoin);
    return () => {
      socket.off("join:room", handleRoomJoin);
    };
  }, [socket, handleRoomJoin]);
  return (
    <div className="w-screen h-screen bg-black flex flex-col justify-center">
      <div className="w-[30%] mx-auto  p-3 bg-white border rounded-md flex flex-col gap-y-3">
        <div className="flex flex-col w-full">
          <Input
            label="Enter email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <Input
            label="Enter roomId"
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
          />
        </div>
        <button
          onClick={handleButtonClick}
          className="cursor-pointer p-2 bg-blue-900 rounded-lg text-white font-semibold text-lg"
        >
          Enter RoomId
        </button>
      </div>
    </div>
  );
};

export default HomePage;
