import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../providers/socket";
import ReactPlayer from "react-player";
import peer from "../services/peer";

const RoomPage = () => {
  const { roomId } = useParams();
  const socket = useSocket();
  const [remoteId, setRemoteId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const handleUserJoined = useCallback((data) => {
    setRemoteId(data?.id);
  }, []);
  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteId(from);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    },
    [socket]
  );
  const handleCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteId, offer });
    setMyStream(stream);
  };
  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);
  const handleCallAccepted = useCallback(
    ({ ans }) => {
      peer.setRemoteDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );
  const handleNegotiationNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("negotiation:needed", { to: remoteId, offer });
  }, []);
  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.peer.removeEventListener(
        "negotiationneeded",
        handleNegotiationNeeded
      );
    };
  }, [handleNegotiationNeeded]);
  useEffect(() => {
    peer.peer.addEventListener("track", (event) => {
      const remote = event.streams;
      setRemoteStream(remote[0]);
    });
  }, []);
  const handleNegotiationCall = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("negotiation:accepted", { to: from, ans });
    },
    [socket]
  );
  const handleNegotiationFinal = useCallback(({ ans }) => {
    peer.setRemoteDescription(ans);
  }, []);
  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("negotiation:call", handleNegotiationCall);
    socket.on("negotiation:final", handleNegotiationFinal);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("negotiation:call", handleNegotiationCall);
      socket.off("negotiation:final", handleNegotiationFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationCall,
    handleNegotiationFinal,
  ]);

  return (
    <div className="w-screen h-screen bg-black flex flex-col text-white text-center">
      <div className="w-[60%] mx-auto p-3 flex flex-col gap-y-3">
        <h1 className="font-semibold text-4xl text-center">
          Welcome to room {roomId}{" "}
        </h1>
        {remoteId ? (
          <span className="font-semibold text-xl">Someone Joined room</span>
        ) : (
          <span className="font-semibold text-xl ">Nobody in the room</span>
        )}
        {myStream && (
          <button
            className="bg-blue-900 p-3 rounded-md w-[50%] mt-6 text-xl mx-auto"
            onClick={sendStreams}
          >
            Send Streams
          </button>
        )}
        {remoteId ? (
          <button
            onClick={handleCall}
            className="bg-gray-500 p-3 rounded-md w-[50%] mt-6 text-xl mx-auto"
          >
            Call
          </button>
        ) : (
          <></>
        )}
        {myStream && (
          <div className="w-full mt-8 flex flex-col gap-y-6">
            <span className="text-lg font-semibold">MyStream</span>
            <ReactPlayer
              playing
              url={myStream}
              width={500}
              height={250}
              muted
            ></ReactPlayer>
          </div>
        )}
        {remoteStream && (
          <div className="w-full mt-8 flex flex-col gap-y-6">
            <span className="text-lg font-semibold">Remote Stream</span>
            <ReactPlayer
              playing
              url={remoteStream}
              width={500}
              height={250}
              muted
            ></ReactPlayer>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
