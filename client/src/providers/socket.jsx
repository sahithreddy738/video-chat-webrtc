import { createContext, useMemo } from "react";
import { io } from "socket.io-client";

const Socket = createContext(null);

export const SocketProvider = (props) => {
  const socket = useMemo(() => io("http://localhost:8000"), []);

  return <Socket.Provider value={socket}>{props.children}</Socket.Provider>;
};
