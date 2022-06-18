import {
  ArrowLeft,
  Close,
  Pause,
  Send,
  SmileyFace,
  Speaker,
} from "assets/icons";
import { Avatar } from "components/core";
import React from "react";
import { Link } from "react-router-dom";

const View = () => {
  return (
    <section className="flex flex-col relative ">
      <div className="w-full bg-gradient-to-b from-gray-900 to-transparent flex items-center justify-between absolute top-0 left-0 z-[20]  p-4">
        <span className="flex items-center justify-center">
          <ArrowLeft className="text-white text-2xl cursor-pointer " />
        </span>
        <div className="w-[450px] flex flex-col gap-4 ">
          <div className="w-full flex items-center gap-2 ">
            <ProgressBar value={100} />
            <ProgressBar value={80} />
            <ProgressBar value={0} />
          </div>
          <div className="flex items-center justify-between">
            <Link
              to={`/profile/$1`}
              className="w-full      flex items-center gap-4   "
            >
              <Avatar src="https://pps.whatsapp.net/v/t61.24694-24/199271581_1636791406665605_6325613774549162606_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVw6T-y4Bn2ZU9oP7uT1qEGSRH8akBzns5J6SkF-Sbe26Q&oe=62BAAB3D" />

              <div className="flex flex-col">
                <small className=" text-gray-900 dark:text-white font-normal text-base tracking-wide">
                  My Status
                </small>
                <small className="text-gray-400 font-normal tracking-wide">
                  updated 2h ago
                </small>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Pause className="text-white text-2xl cursor-pointer " />
              <Speaker className="text-white text-2xl cursor-pointer " />
            </div>
          </div>
        </div>
        <span className="flex items-center justify-center">
          <Close className="text-white text-2xl cursor-pointer " />
        </span>
      </div>
      <div
        className="w-full h-screen bg-cover  bg-white dark:bg-gray-900 relative "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1655387442033-47c251707042?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80')",
        }}
      ></div>
      <div className="w-full flex absolute bottom-0 left-0 items-center justify-center ">
        <div className="flex items-center flex-col w-full justify-center p-4 bg-gradient-to-t from-gray-900 to-transparent ">
          <div className="w-full flex items-center gap-4 justify-center "></div>
          <div className="w-full flex items-center gap-4 justify-center ">
            <SmileyFace className="text-white text-2xl cursor-pointer relative z-10 " />
            <input
              type="text"
              className="bg-gray-900/70 dark:gray-900 max-w-[600px] w-full  px-4 py-2 rounded-md border border-gray-100/20 "
              placeholder="Type a replay..."
            />

            <Send className="text-white text-4xl cursor-pointer relative z-10 " />
          </div>
        </div>
      </div>
    </section>
  );
};

export default View;

const ProgressBar = ({
  value,
  onClick,
}: {
  value: number;
  onClick?: () => void;
}) => {
  return (
    <div
      className="w-full h-fit flex items-center bg-gray-500/30 rounded-full overflow-hidden "
      onClick={onClick}
    >
      <span
        className="bg-white  h-[7px] transition-all ease-in-out duration-300 "
        style={{
          width: `${value}%`,
        }}
      ></span>
    </div>
  );
};
