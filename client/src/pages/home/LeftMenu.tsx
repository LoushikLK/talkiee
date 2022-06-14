import { Search } from "assets/icons";
import { Avatar } from "components/core";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { friendsPath } from "config/path";
import moment from "moment";
import { useSelector } from "react-redux";
import { SELECTOR_TYPE, User } from "types";

const LeftMenu = () => {
  const [userFriend, setUserFriend] = useState([]);
  const [activeChat, setActiveChat] = useState("");
  const [totalUnseenMessage, setTotalUnseenMessage] = useState(0);
  const navigate = useNavigate();

  const user: User = useSelector((state: SELECTOR_TYPE) => state.userDetail);

  // console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken");
      const result = await fetch(friendsPath, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await result.json();
      console.log(data);
      if (result.status !== 200) {
        setUserFriend([]);
        return;
      }
      setUserFriend(data.data);

      // console.log(data.data);
    };
    fetchData();
  }, []);

  const handleNavigation = (item: any) => {
    try {
      console.log(item);
      navigate(`/message/${item?._id}`, {
        state: {
          name: item?.user?.name,
          profileImage: item?.user?.profileImage,
          _id: item?.user?._id,
          gender: item?.user?.gender,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userFriend?.length === 0) {
      return;
    }

    let mounted = true;

    if (mounted) {
      const totalCount = userFriend.reduce((acc: any, curr: any) => {
        return acc + curr?.unseenMessages;
      }, 0);

      // console.log(totalCount);

      setTotalUnseenMessage(totalCount);
    }
  }, [userFriend]);
  // console.log(userFriend);

  return (
    <div className="w-[25rem] relative h-screen overflow-hidden overflow-y-auto bg-white dark:bg-gray-900 flex-col left-menu-scroll flex gap-2">
      <div className="w-full p-4 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 ">
        <span className="flex gap-2 items-center">
          <h3 className="text-black font-medium text-xl dark:text-white tracking-wide">
            Messages
          </h3>
          <span className="bg-pink-500 text-xs flex items-center justify-center  text-black dark:text-white text-center font-normal rounded-full h-5 w-5 ">
            {totalUnseenMessage}
          </span>
        </span>
        <span className="text-black dark:text-white cursor-pointer p-2 bg-gray-200/20 rounded-full">
          <Search className="text-gray-900 dark:text-white text-xl" />
        </span>
      </div>
      <div className="h-fit flex flex-col  ">
        {userFriend?.map((item: any, index: number) => {
          return (
            <div
              className={` ${
                activeChat === item?._id
                  ? "bg-gradient-to-r from-[#f973162b] to-transparent border-orange-500"
                  : ""
              } w-full p-4 flex flex-row items-center  gap-2 cursor-pointer border-l-4 border-transparent  border-b !border-b-gray-200/10 hover:border-orange-500 bg-gradient-to-r from-transparent to-transparent hover:from-[#f973162b] hover:to-transparent transition-all ease-in-out duration-300 `}
              key={item?._id}
              onClick={() => {
                handleNavigation(item);
                setActiveChat(item?._id);
              }}
            >
              <div className="">
                <Avatar
                  src={item?.user?.profileImage}
                  name={item?.user?.name}
                />
              </div>
              <div className="flex flex-row items-center justify-between w-full ">
                <span className="flex flex-col  items-baseline">
                  <h3 className="text-black dark:text-white font-medium text-base tracking-wide">
                    {item?.user?.name}
                  </h3>
                  <small
                    className={`text-black dark:text-gray-50/80 ${
                      user?._id === item?.message?.sender
                        ? "font-normal"
                        : "font-bold"
                    }  tracking-wide`}
                  >
                    {item?.message?.message}
                  </small>
                </span>
                <span className="flex flex-col gap-2 items-end">
                  <small className="text-black text-[12px] dark:text-white">
                    {moment(item?.message?.createdAt).fromNow()}
                  </small>
                  {item?.unseenMessages > 0 && (
                    <span className="bg-pink-500 text-[12px] flex items-center justify-center  text-black dark:text-white text-center font-normal rounded-full h-6 w-6 ">
                      {item?.unseenMessages}
                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftMenu;
