import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { User } from "types";
import { socketPath } from "./path";

const { useContext, useRef, createContext, useEffect } = require("react");

export const SocketContext = createContext();

const SocketContextProvider = ({ children }: any) => {
  const user: User = useSelector((state: any) => state?.userDetail);

  const socket = useRef();

  useEffect(() => {
    if (!user?._id) {
      return;
    }
    socket.current = io(socketPath);
    socket?.current.on("connect", () => {
      socket?.current.emit("user-online", user?._id);

      console.log(socket?.current.id);
      // socket?.current?.emit("join-room", params?.id);
    });
  }, [user?._id]);

  useEffect(() => {
    socket?.current?.on("disconnect", () => {
      socket?.current?.emit("user-offline", user?._id);
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
