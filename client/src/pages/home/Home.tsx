import {
  Attachment,
  Call,
  Mic,
  Send,
  ThreeDots,
  VideoCall,
} from "assets/icons";
import { Avatar } from "components/core";
import React, { useEffect, useRef } from "react";
import LeftMenu from "./LeftMenu";

const Home = () => {
  const [messageData, setMessageData] = React.useState([
    {
      id: 1,
      message: "Hello World",
      sender: "1",
    },
    {
      id: 2,
      message: "Hello World from second user",
      sender: "2",
    },
  ]);

  const [message, setMessage] = React.useState("");

  const focusField = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    console.log("send message");
    if (!message) return;
    setMessageData((prevState) => [
      ...prevState,
      {
        id: messageData.length + 1,
        message: message,
        sender: "1",
      },
    ]);
    setMessage("");
  };

  useEffect(() => {
    if (focusField.current) {
      focusField.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageData]);

  return (
    <section className="bg-white dark:bg-gray-900 flex-row flex h-screen overflow-hidden ">
      <LeftMenu />
      <div className="w-full flex flex-col  bg-white dark:bg-gray-900 px-4 pt-4 relative ">
        <div className="w-full h- z-30 flex items-center left-0 justify-between sticky top-0 dark:shadow-gray-100/10  dark:bg-gray-900 bg-white shadow-lg p-4 rounded-2xl ">
          <div className="flex gap-4 items-center w-fit">
            <Avatar
              name="LL"
              src="https://avatars.dicebear.com/api/avataaars/man.svg"
              onClick={() => {
                console.log("clicked");
              }}
            />
            <span className="flex flex-col gap-1">
              <h3 className="font-medium tracking-wide text-lg text-black dark:text-white ">
                Don Loushik
              </h3>
              <small className="text-gray-500 tracking-wide">Active now</small>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-200/10 h-10 rounded-full cursor-pointer select-none w-10 flex items-center justify-center ">
              <Call className="text-gray-500 text-[1.5rem]  " />
            </span>

            <span className="bg-gray-200/10 h-10 rounded-full cursor-pointer select-none w-10 flex items-center justify-center ">
              <VideoCall className="text-gray-500 text-[1.5rem]  " />
            </span>

            <span className="bg-gray-200/10 h-10 rounded-full cursor-pointer select-none w-10 flex items-center justify-center ">
              <ThreeDots className="text-gray-500 text-[1.5rem]  " />
            </span>
          </div>
        </div>
        <div className="flex flex-col h-max overflow-y-auto left-menu-scroll">
          {messageData?.map((message, index) => {
            return (
              <React.Fragment key={index}>
                {message?.sender === "1" ? (
                  <div
                    className="relative w-full py-4 left-0  gap-4 flex items-start justify-start"
                    ref={focusField}
                  >
                    <Avatar src=" https://picsum.photos/200/300 " />
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
                        2 hours ago
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
                          2 hours ago
                        </small>
                        <small className="text-gray-500 tracking-wide">
                          //
                        </small>
                      </span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="w-full h-fit flex absolute bottom-0 left-0 items-center justify-between gap-4 bg-white  dark:bg-gray-900 p-4 ">
          <div className="flex w-full items-center border p-2 rounded-full  ">
            <Mic className="text-gray-500 text-2xl  " />
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
    </section>
  );
};

export default Home;
