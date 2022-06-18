import { Avatar } from "components/core";
import React from "react";
import { Link } from "react-router-dom";

const LeftMenu = () => {
  return (
    <div className="w-[25rem] bg-white  h-screen overflow-hidden overflow-y-auto left-menu-scroll flex flex-col border-r border-gray-900/10 dark:border-gray-100/10 bg-gray-700/10 ">
      <Link
        to={`/status/view/1`}
        className="w-full py-8 flex items-center gap-4 border-b px-4 border-gray-900/10 dark:border-gray-100/10 "
      >
        <Avatar src="https://pps.whatsapp.net/v/t61.24694-24/199271581_1636791406665605_6325613774549162606_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVw6T-y4Bn2ZU9oP7uT1qEGSRH8akBzns5J6SkF-Sbe26Q&oe=62BAAB3D" />

        <div className="flex flex-col">
          <small className=" text-gray-900 dark:text-white font-medium text-base tracking-wide">
            My Status
          </small>
          <small className="text-gray-500 font-medium tracking-wide">
            No Update
          </small>
        </div>
      </Link>

      <div className="w-full flex flex-col border-b pb-2 border-gray-900/10 dark:border-gray-100/10 ">
        <small className="text-gray-500 font-medium uppercase px-4 my-2">
          RECENT
        </small>
        <Link
          to={`/status/view/1`}
          className="w-full py-2 flex items-center gap-4 cursor-pointer select-none bg-transparent hover:bg-gray-200/10 transition-all ease-in-out duration-300 px-4  "
        >
          <span className="w-fit h-fit rounded-full  border-cyan-500 border-2 p-[2px] ">
            <Avatar src="https://pps.whatsapp.net/v/t61.24694-24/199271581_1636791406665605_6325613774549162606_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVw6T-y4Bn2ZU9oP7uT1qEGSRH8akBzns5J6SkF-Sbe26Q&oe=62BAAB3D" />
          </span>

          <div className="flex flex-col">
            <small className="text-gray-900 dark:text-white font-medium text-base tracking-wide">
              Loushik
            </small>
            <small className="text-gray-500 font-medium tracking-wide">
              today at 10:00 AM
            </small>
          </div>
        </Link>
        <Link
          to={`/status/view/1`}
          className="w-full py-2 flex items-center gap-4 cursor-pointer select-none bg-transparent hover:bg-gray-200/10 transition-all ease-in-out duration-300 px-4  "
        >
          <span className="w-fit h-fit rounded-full  border-cyan-500 border-2 p-[2px] ">
            <Avatar src="https://pps.whatsapp.net/v/t61.24694-24/199271581_1636791406665605_6325613774549162606_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVw6T-y4Bn2ZU9oP7uT1qEGSRH8akBzns5J6SkF-Sbe26Q&oe=62BAAB3D" />
          </span>

          <div className="flex flex-col">
            <small className=" text-gray-900 dark:text-white font-medium text-base tracking-wide">
              LK
            </small>
            <small className="text-gray-500 font-medium tracking-wide">
              today at 1:35 AM
            </small>
          </div>
        </Link>
      </div>
      <div className="w-full flex flex-col">
        <small className="text-gray-500 font-medium uppercase px-4 my-2">
          VIEWED
        </small>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
          <Link
            to={`/status/view/1`}
            className="w-full py-2 flex items-center gap-4 cursor-pointer select-none bg-transparent hover:bg-gray-200/10 transition-all ease-in-out duration-300 px-4  "
            key={index}
          >
            <span className="w-fit h-fit rounded-full border-white border-2 p-[2px] ">
              <Avatar src="https://pps.whatsapp.net/v/t61.24694-24/199271581_1636791406665605_6325613774549162606_n.jpg?stp=dst-jpg_s96x96&ccb=11-4&oh=01_AVw6T-y4Bn2ZU9oP7uT1qEGSRH8akBzns5J6SkF-Sbe26Q&oe=62BAAB3D" />
            </span>

            <div className="flex flex-col">
              <small className=" text-gray-900 dark:text-white   font-medium text-base tracking-wide">
                Loushik
              </small>
              <small className="text-gray-500 font-medium tracking-wide">
                today at 10:00 AM
              </small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LeftMenu;
