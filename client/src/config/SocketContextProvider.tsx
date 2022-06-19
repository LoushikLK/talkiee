import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { User } from "types";
import { socketPath } from "./path";

const { useContext, createContext, useEffect } = require("react");

export const SocketContext = createContext();

const SocketContextProvider = ({ children }: any) => {
  const user: User = useSelector((state: any) => state?.userDetail);

  const socket = useRef<any>(null);

  useEffect(() => {
    socket.current = io(socketPath);

    socket?.current?.on("connect", () => {
      if (!user?._id) {
        return;
      }
      socket?.current?.emit("user-online", user?._id);
    });
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

const useSocketContext = () => {
  const { socket } = useContext(SocketContext);
  return { socket };
};

export { useSocketContext };

export default SocketContextProvider;
