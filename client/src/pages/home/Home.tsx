import LeftMenu from "./LeftMenu";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { User } from "types";
import { useSelector } from "react-redux";
import { socketPath } from "config/path";
import ChatSection from "./ChatSection";

const Home = () => {
  const [conversationId, setConversationId] = useState("");
  const [receiverUser, setReceiverUser] = useState<User>({});

  const [arrivalMessage, setArrivalMessage] = useState<any>(null);

  const user: User = useSelector((state: any) => state.userDetail);

  const socket = useRef(io(socketPath));

  useEffect(() => {
    socket?.current?.on("connect", () => {
      if (!user?._id) {
        return;
      }
      socket?.current.emit("user-online", user?._id);
    });
  }, [user?._id]);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("message-receive", (data: any) => {
        setArrivalMessage(data);
      });
    }
  }, [socket]);

  return (
    <section className="bg-white dark:bg-gray-900 flex-row flex h-screen overflow-hidden ">
      <LeftMenu
        setConversationId={setConversationId}
        receiverUser={receiverUser}
        setReceiverUser={setReceiverUser}
        socket={socket}
        arrivalMessage={arrivalMessage}
      />

      <ChatSection
        socket={socket}
        receiverUser={receiverUser}
        conversationId={conversationId}
        setArrivalMessage={setArrivalMessage}
      />
    </section>
  );
};

export default Home;
