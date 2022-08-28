import {
  Attachment,
  Call,
  Check,
  Send,
  SmileyFace,
  ThreeDots,
  VideoCall,
} from "assets/icons";
import { Avatar } from "components/core";
import { getMessagePath, sendMessagePath } from "config/path";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import moment from "moment";
import { SELECTOR_TYPE, User } from "types";

import { v4 } from "uuid";
import { newMessageAnimation } from "assets/animations";
import Lottie from "react-lottie";
import Picker from "emoji-picker-react";

type Props = {
  socket: any;
  conversationId?: string;
  setArrivalMessage: (message: any) => void;
  receiverUser?: any;
};

const ChatSection = ({
  socket,
  conversationId,
  receiverUser,
  setArrivalMessage,
}: Props) => {
  const newMessageOption = {
    loop: true,
    autoplay: true,
    animationData: newMessageAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [messageData, setMessageData] = React.useState<any[]>([]);
  const [message, setMessage] = React.useState("");
  const [showEmoji, setShowEmoji] = React.useState(false);
  const [receiverData, setReceiverData] = React.useState<any>(null);
  const [receiverOnline, setReceiverOnline] = React.useState(false);
  const [upcomingMessage, setUpcomingMessage] = React.useState<any>(null);

  const user: User = useSelector((state: SELECTOR_TYPE) => state.userDetail);

  const focusField = useRef<HTMLInputElement>(null);

  const emojiContainer = useRef<any>(null);
  const emojiButtonRef = useRef<any>(null);

  useEffect(() => {
    if (socket?.current) {
      socket.current.on("message-receive", (data: any) => {
        setUpcomingMessage(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (upcomingMessage) {
      if (upcomingMessage?.conversationId === conversationId) {
        setMessageData((prevState: any) => [...prevState, upcomingMessage]);
      }
    }
  }, [upcomingMessage]);

  // console.log(arrivalMessage);

  // console.log({ receiverId });

  const handleSendMessage = async () => {
    try {
      if (message.trim().length === 0) {
        return;
      }

      const data = {
        message,
        receiver: receiverUser?._id,
      };

      setMessageData((prevState) => {
        return [
          ...prevState,
          {
            message: message,
            userId: user?._id,
            conversationId: conversationId,
            receiver: receiverUser?._id,
            sender: user?._id,
            seen: false,
            createdAt: Date.now(),
            _id: v4(),
          },
        ];
      });

      socket?.current.emit("send-message", {
        message: message,
        userId: user?._id,
        conversationId: conversationId,
        receiver: receiverUser?._id,
        sender: user?._id,
        seen: false,
        delivered: true,
        createdAt: Date.now(),
        _id: v4(),
      });

      setArrivalMessage({
        message: message,
        userId: user?._id,
        conversationId: conversationId,
        receiver: receiverUser?._id,
        sender: user?._id,
        seen: false,
        delivered: true,
        createdAt: Date.now(),
        _id: v4(),
      });

      const authToken = localStorage.getItem("authToken");

      await fetch(sendMessagePath, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(messageData[messageData?.length - 1]);

  useEffect(() => {
    let mounted = true;
    if (!conversationId) {
      setMessageData([]);
      return;
    }

    const fetchMessage = async () => {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(getMessagePath + `/${receiverUser?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      // console.log(data);
      if (response.status !== 200) {
        setMessageData([]);
        return;
      }
      setMessageData(data?.data?.reverse());
    };

    if (mounted) {
      fetchMessage();
    }

    return () => {
      mounted = false;
    };
  }, [conversationId]);

  useEffect(() => {
    if (focusField.current) {
      focusField.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  // console.log(messageData);
  return (
    <>
      {conversationId ? (
        <div
          className={`w-full flex flex-col message-box-chat  px-4 pt-4 relative `}
        >
          <div className="w-full h- z-30 flex items-center left-0 justify-between sticky top-0 dark:shadow-gray-100/10  dark:bg-gray-900 bg-white shadow-lg p-4 rounded-2xl ">
            <div className="flex gap-4 items-center w-fit">
              <Avatar
                name="LL"
                src={`https://avatars.dicebear.com/api/male/${Math.random()}.svg`}
                onClick={() => {
                  console.log("clicked");
                }}
              />
              <span className="flex flex-col gap-1">
                <h3 className="font-medium tracking-wide text-lg text-black dark:text-white ">
                  Neil Armstrong
                </h3>
                <small className="text-gray-500 tracking-wide">
                  {receiverOnline ? "Online" : "Offline"}
                </small>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="bg-gray-200/10 h-10 rounded-full cursor-pointer select-none w-10 flex items-center justify-center "
                onClick={() => {
                  Swal.fire({
                    title: "This feature is still in development.",
                    icon: "success",
                  });
                }}
              >
                <Call className="text-gray-500 text-[1.5rem]  " />
              </span>

              <span
                className="bg-gray-200/10 h-10 rounded-full cursor-pointer select-none w-10 flex items-center justify-center "
                onClick={() => {
                  Swal.fire({
                    title: "This feature is still in development.",
                    icon: "success",
                  });
                }}
              >
                <VideoCall className="text-gray-500 text-[1.5rem]  " />
              </span>

              <span className="bg-gray-200/10 h-10 rounded-full cursor-pointer select-none w-10 flex items-center justify-center ">
                <ThreeDots className="text-gray-500 text-[1.5rem]  " />
              </span>
            </div>
          </div>

          {/* <div className="w-full flex items-center justify-center flex-col gap-4 my-8 ">
            <small className="py-2 px-4 bg-gray-100/10 rounded-md text-gray-500 tracking-wide uppercase">
              Today
            </small>

            <span className="text-center text-xs font-medium tracking-wide flex items-center gap-2 bg-gray-900 py-2 px-4 text-yellow-500 rounded-md ">
              <Lock />
              <h3>
                Message with {state?.name} are end-to-end encrypted. No one can
                read your messages not even us.
              </h3>
            </span>
          </div> */}

          <div className="flex flex-col h-max overflow-y-auto left-menu-scroll pb-20 ">
            {messageData?.map((message: any, index) => {
              return (
                <React.Fragment key={index}>
                  {message?.receiver === user?._id ? (
                    <div
                      className="relative w-full py-4 left-0  gap-4 flex items-start justify-start"
                      ref={focusField}
                    >
                      <Avatar
                        src={`https://avatars.dicebear.com/api/male/${Math.random()}.svg`}
                      />
                      <div className="w-full flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="max-w-[90%] md:max-w-[70%] w-fit    text-sm text-white rounded-md
                     bg-cyan-500 font-medium tracking-wide p-4"
                          >
                            {message?.message}
                          </span>
                          <ThreeDots className="text-gray-500 cursor-pointer " />
                        </div>
                        <small className="text-gray-500 tracking-wide">
                          {moment(message?.createdAt).fromNow()}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="relative w-full left-0 text-sm  py-4 flex items-center justify-end  "
                      ref={focusField}
                    >
                      <div className="w-full flex flex-col items-end mr-4  gap-2">
                        <span className="max-w-[90%] md:max-w-[70%] w-fit  text-sm bg-gray-100 rounded-md shadow-lg font-medium tracking-wide p-4">
                          {message?.message}
                        </span>
                        <span className="flex items-center gap-2">
                          <small className="text-gray-500 tracking-wide">
                            {moment(message?.createdAt).fromNow()}
                          </small>
                          <Check
                            className={
                              message?.seen ? "text-blue-500" : "text-gray-500"
                            }
                          />
                        </span>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <div className="w-full h-fit flex absolute bottom-0 left-0 items-center justify-between gap-4 bg-white  dark:bg-gray-900 p-4    z-10  ">
            <div
              className="flex w-full items-center border p-2 rounded-full "
              ref={emojiContainer}
            >
              {showEmoji && (
                <span
                  className="absolute top-full left-0 w-full h-4 z-10
                 "
                >
                  <Picker
                    onEmojiClick={(e: any, emoji: any) => {
                      setMessage((prev: any) => {
                        return prev + emoji.emoji;
                      });
                    }}
                    pickerStyle={{ width: "100%" }}
                  />
                </span>
              )}
              <span className="w-fit h-fit" ref={emojiButtonRef}>
                <SmileyFace
                  className="text-gray-500 text-2xl cursor-pointer relative z-10 "
                  onClick={() => {
                    setShowEmoji(!showEmoji);
                  }}
                />
              </span>

              <input
                type="text"
                placeholder="Type a message..."
                className="w-full focus:outline-none bg-transparent text-black dark:text-white pl-4 "
                value={message}
                onChange={(e: any) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
              <Attachment className="text-gray-500 text-2xl " />
            </div>
            <span
              className="bg-gray-200/20 rounded-full h-10 w-10 flex items-center justify-center cursor-pointer  "
              onClick={handleSendMessage}
            >
              <Send className="text-cyan-500 text-2xl" />
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col  bg-white dark:bg-slate-700 px-4 pt-4 relative items-center justify-center ">
          <span className="w-fit h-fit flex items-center gap-4  flex-col">
            <Lottie options={newMessageOption} height={350} width={350} />
            <small className="text-white tracking-wide text-center">
              Send and receive messages by clicking on the person you want to
              chat with or by clicking on the plus icon in the top right corner.
            </small>
          </span>
        </div>
      )}
    </>
  );
};

export default ChatSection;
