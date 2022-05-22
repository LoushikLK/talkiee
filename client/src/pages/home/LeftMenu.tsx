import { Search } from "assets/icons";

const LeftMenu = () => {
  return (
    <div className="w-[25rem] bg-white dark:bg-gray-900 flex-col flex gap-2">
      <div className="w-full p-4 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <h3 className="text-black font-medium text-xl dark:text-white tracking-wide">
            Messages
          </h3>
          <span className="bg-pink-500 text-xs flex items-center justify-center  text-black dark:text-white text-center font-normal rounded-full h-5 w-5 ">
            10
          </span>
        </span>
        <span className="text-black dark:text-white cursor-pointer p-2 bg-gray-200/20 rounded-full">
          <Search className="text-gray-900 dark:text-white text-xl" />
        </span>
      </div>
      <div className="h-full flex flex-col ">
        <div className="w-full p-4 flex flex-row items-center justify-between gap-2">
          <span className="w-16 h-16 flex items-center">
            <img
              src="https://source.unsplash.com/random"
              className="h-12 w-12 object-cover rounded-full"
              alt=""
            />
          </span>
          <span className="flex flex-row items-center justify-between">
            <span className="flex flex-col  items-baseline">
              <h3 className="text-black dark:text-white font-medium text-base tracking-wide">
                John Doe
              </h3>
              <small className="text-black dark:text-gray-50/80 font-medium  tracking-wide">
                Lorem ipsum dolor sit.
              </small>
            </span>
            <span className="flex flex-col gap-2 items-end">
              <small className="text-black dark:text-white">
                5 minutes ago
              </small>
              <span className="bg-pink-500 text-xs flex items-center justify-center  text-black dark:text-white text-center font-normal rounded-full h-6 w-6 ">
                10
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
