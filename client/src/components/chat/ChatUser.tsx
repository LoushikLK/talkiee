import { ArrowLeft } from "assets/icons";
import { Avatar } from "components/core";
import { useEffect, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose?: () => void;
  className?: string;
};
const ChatUser = ({ open, onClose, className }: Props) => {
  const [viewFiles, setViewFiles] = useState(false);
  const containerRef = useRef<any>();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      //   if (optionButtonRef?.current?.contains(event.target)) {
      //     return;
      //   }
      if (
        containerRef?.current &&
        !containerRef?.current?.contains(event?.target)
      ) {
        onClose?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div
      className={` ${
        !open ? "translate-x-full" : "translate-x-0"
      } transition-all ease-in-out duration-300 h-screen  flex justify-end z-[9999] w-screen  absolute top-0 right-0 `}
    >
      <div
        className={` min-h-screen overflow-y-auto left-menu-scroll border-l bg-white dark:bg-gray-900 ${className} `}
        ref={containerRef}
      >
        {viewFiles ? (
          <div className=" flex flex-col gap-4 w-[32rem] ">
            <div className=" flex border-b border-gray-50/20 p-4">
              <ArrowLeft
                className="text-black dark:text-white text-2xl cursor-pointer "
                onClick={() => setViewFiles(false)}
              />
            </div>
            <div className="flex flex-col gap-4 p-4 ">
              <div className="flex flex-col gap-4 ">
                <h3 className="font-medium tracking-wide text-black dark:text-white text-lg">
                  August
                </h3>
                <div className="flex items-center flex-wrap gap-4 ">
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 ">
                <h3 className="font-medium tracking-wide text-black dark:text-white text-lg">
                  September
                </h3>
                <div className="flex items-center flex-wrap gap-4 ">
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4 max-w-lg ">
            <div className="flex flex-col gap-8 items-center bg-gray-200 dark:bg-gray-700/50 p-4 w-full">
              <Avatar alt="User Avatar" className="!h-48 !w-48" name="LK" />

              <div className="w-full flex flex-col items-center">
                <h3 className="font-medium tracking-wide text-black dark:text-white text-xl">
                  Loushik giri
                </h3>
                <h3 className="font-medium tracking-wide text-base text-gray-400 ">
                  +91 1234567890
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4 bg-gray-200 dark:bg-gray-700/50">
              <h3 className="font-medium tracking-wide text-black dark:text-white text-lg">
                About
              </h3>
              <p className="tracking-wide text-base font-medium text-gray-400 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Non,
                veritatis unde, animi, nostrum repellendus incidunt maxime
                aspernatur nam amet tempora veniam similique? Quam, obcaecati
                labore?
              </p>
            </div>
            <div className="flex flex-col gap-4 p-4 bg-gray-200 dark:bg-gray-700/50">
              <h3 className="font-medium tracking-wide text-black dark:text-white text-lg">
                Media Files
              </h3>
              <div className="flex items-center  relative ">
                <div className="w-full flex items-center overflow-hidden overflow-x-auto hidden-scrollbar ">
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                  <div className=" min-w-fit ">
                    <img
                      src="https://picsum.photos/200/300"
                      className="w-40 h-40 object-cover "
                      alt="material"
                    />
                  </div>
                </div>
                <div
                  className="h-full absolute w-20  dark:text-white font-medium tracking-wide cursor-pointer backdrop-blur-xl top-0 right-0 flex items-center justify-center "
                  onClick={() => setViewFiles(true)}
                >
                  View All
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-4 bg-gray-200 dark:bg-gray-700/50">
              <h3 className="font-medium tracking-wide text-black dark:text-white text-lg">
                Group in common
              </h3>
              <div className="flex flex-col">
                <div
                  className={` 
                     w-full p-4 flex flex-row items-center  gap-2 cursor-pointer border-transparent  border-b !border-b-gray-200/10 hover:border-orange-500 bg-gradient-to-r from-transparent to-transparent hover:from-[#f973162b] hover:to-transparent transition-all ease-in-out duration-300 `}
                >
                  <div className="">
                    <Avatar name={"College Group"} />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full ">
                    <span className="flex flex-col  items-baseline">
                      <h3 className="text-black dark:text-white font-medium text-base tracking-wide">
                        College Group
                      </h3>
                      <small
                        className={`text-black dark:text-gray-50/80 tracking-wide`}
                      >
                        You , Loushik , lk , lk , lk , lk , lk , lk...
                      </small>
                    </span>
                  </div>
                </div>
                <div
                  className={` 
                     w-full p-4 flex flex-row items-center  gap-2 cursor-pointer border-transparent  border-b !border-b-gray-200/10 hover:border-orange-500 bg-gradient-to-r from-transparent to-transparent hover:from-[#f973162b] hover:to-transparent transition-all ease-in-out duration-300 `}
                >
                  <div className="">
                    <Avatar name={"College Group"} />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full ">
                    <span className="flex flex-col  items-baseline">
                      <h3 className="text-black dark:text-white font-medium text-base tracking-wide">
                        College Group
                      </h3>
                      <small
                        className={`text-black dark:text-gray-50/80 tracking-wide`}
                      >
                        You , Loushik , lk , lk , lk , lk , lk , lk...
                      </small>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUser;
