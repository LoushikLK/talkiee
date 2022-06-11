import { Attachment, Call, Mic, ThreeDots, VideoCall } from "assets/icons";
import { Avatar } from "components/core";
import React from "react";
import LeftMenu from "./LeftMenu";

const Home = () => {
  return (
    <section className="bg-white dark:bg-gray-900 flex-row flex ">
      <LeftMenu />
      <div className="w-full flex flex-col  bg-white dark:bg-gray-900 p-4 relative ">
        <div className="w-full flex items-center justify-between sticky top-0   dark:bg-gray-900 bg-white shadow-lg p-4 rounded-2xl ">
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

        <div className="w-full h-fit">
          <div className="w-full h-full">jfvhfj</div>
          <div className="w-full h-fit flex items-center gap-8 justify-between  absolute bottom-0 ">
            <div className="w-full flex items-center ">
              <Mic className="text-[1.5rem] text-gray-500 " />
              <input type="text" className="w-full" />
              <Attachment className="text-[1.5rem] text-gray-500 " />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
