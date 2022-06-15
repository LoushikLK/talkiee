import LeftMenu from "./LeftMenu";
import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { User } from "types";
import { useSelector } from "react-redux";
import { socketPath } from "config/path";
import ChatSection from "./ChatSection";

const Home = () => {
  const [conversationId, setConversationId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [activeUser, setActiveUser] = useState("");
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

  console.log(socket?.current?.id);

  useEffect(() => {
    socket?.current?.on("user-online", (data: any) => {
      // console.log(data);
      setActiveUser(data);
    });
    socket?.current?.on("user-details", (data: any) => {
      console.log("user-details", data);
    });
  }, [socket]);

  useEffect(() => {
    if (receiverId) {
      socket?.current?.emit("get-user-data", receiverId);
    }
  }, [receiverId]);

  return (
    <section className="bg-white dark:bg-gray-900 flex-row flex h-screen overflow-hidden ">
      <LeftMenu
        setConversationId={setConversationId}
        setReceiverId={setReceiverId}
        socket={socket}
      />

      <ChatSection
        socket={socket}
        conversationId={conversationId}
        receiverId={receiverId}
        activeUser={activeUser}
      />
    </section>
  );
};

export default Home;
