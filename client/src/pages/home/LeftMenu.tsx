import { Search } from "assets/icons";
import { Avatar } from "components/core";
import {
  ChangeEvent,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { friendsPath, getAllFriends, seenMessagePath } from "config/path";
import moment from "moment";
import { useSelector } from "react-redux";
import { SELECTOR_TYPE, User } from "types";
import { useApiData } from "hooks";

const LeftMenu = ({
  setConversationId,
  socket,
  arrivalMessage,
  setReceiverUser,
  receiverUser,
}: {
  setConversationId: (id: string) => void;
  socket: any;
  arrivalMessage: any;
  setReceiverUser: (user: any) => void;
  receiverUser: any;
}) => {
  const [userFriend, setUserFriend] = useState([]);
  const [sortedFriends, setSortedFriends] = useState<any[]>(userFriend);
  const [activeChat, setActiveChat] = useState("");
  const [totalUnseenMessage, setTotalUnseenMessage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [filteredSearchFriend, setFilteredSearchFriend] =
    useState<any[]>(sortedFriends);

  const [allFriendList, setAllFriendList] = useState<any[]>([]);
  const [searchAllText, setSearchAllText] = useState("");

  const user: User = useSelector((state: SELECTOR_TYPE) => state.userDetail);

  const [openFriendList, setOpenFriendList] = useState(false);

  const allFriendsData = useApiData<any>(getAllFriends);

  console.log(allFriendList);

  // console.log(user);

  const deferredText = useDeferredValue(searchText);
  const deferredAllText = useDeferredValue(searchAllText);

  useEffect(() => {
    let mounted = true;

    if (allFriendsData?.data?.length > 0) {
      if (deferredAllText?.length === 0) {
        mounted && setAllFriendList(allFriendsData?.data);
        return;
      }

      let newFilteredData = allFriendsData?.data?.filter((item: any) => {
        return item?.friend?.name
          ?.toLowerCase()
          ?.includes(deferredText?.toLowerCase());
      });

      mounted && setAllFriendList(newFilteredData);
    }

    return () => {
      mounted = false;
    };
  }, [allFriendsData?.data, deferredAllText]);

  useEffect(() => {
    let mounted = true;

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
      // console.log(data);
      if (result.status !== 200) {
        mounted && setUserFriend([]);
        return;
      }
      mounted && setUserFriend(data.data);
    };
    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  //set all message to seen

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        await fetch(seenMessagePath, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            receiver: user?._id,
            sender: receiverUser?._id,
          }),
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (mounted) {
      fetchData();
    }

    return () => {
      mounted = false;
    };
  }, [receiverUser, arrivalMessage]);

  //changeMessage in left side after new arrival Message

  useEffect(() => {
    let mounted = true;
    if (!arrivalMessage) {
      return;
    }

    const newMessage = {
      _id: arrivalMessage._id,
      conversationId: arrivalMessage.conversationId,
      receiver: arrivalMessage.receiver,
      delivered: arrivalMessage.delivered,
      seen: arrivalMessage.seen,
      sender: arrivalMessage.sender,
      createdAt: arrivalMessage.createdAt,
      message: arrivalMessage.message,
    };
    mounted &&
      setUserFriend((prev: any) => {
        return prev.map((item: any) => {
          if (item?._id === newMessage.conversationId) {
            return {
              ...item,
              message: newMessage,
              unseenMessage: item.unseenMessage + 1,
            };
          }
          return item;
        });
      });

    return () => {
      mounted = false;
    };
  }, [arrivalMessage]);

  //sort user friend list by latest message

  useEffect(() => {
    let mounted = true;
    if (!userFriend.length) {
      return;
    }
    const sorted = userFriend.sort((a: any, b: any) => {
      if (a.message?.createdAt > b.message?.createdAt) {
        return -1;
      }
      if (a.message?.createdAt < b.message?.createdAt) {
        return 1;
      }
      return 0;
    });

    mounted && setSortedFriends(sorted);

    return () => {
      mounted = false;
    };
  }, [userFriend]);

  const handleRoomJoin = (id: string) => {
    socket?.current?.emit("join-room", id);
  };

  useEffect(() => {
    let mounted = true;
    if (userFriend?.length === 0) {
      return;
    }

    if (mounted) {
      const totalCount = userFriend.reduce((acc: any, curr: any) => {
        return acc + curr?.unseenMessages;
      }, 0);

      // console.log(totalCount);

      setTotalUnseenMessage(totalCount);
    }

    return () => {
      mounted = false;
    };
  }, [userFriend]);
  // console.log(userFriend);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      if (deferredText.length === 0) {
        setFilteredSearchFriend(sortedFriends);
        return;
      }
      if (sortedFriends.length === 0) {
        setFilteredSearchFriend([]);
        return;
      }

      let newFilteredFriends = sortedFriends.filter((item) => {
        return item?.user?.name
          ?.toLowerCase()
          .includes(deferredText.toLowerCase());
      });

      setFilteredSearchFriend(newFilteredFriends);
    }

    return () => {
      mounted = false;
    };
  }, [deferredText, sortedFriends]);

  const handleFindBlur = (e: any) => {
    setOpenFriendList(false);
  };

  console.log(openFriendList);

  return (
    <div className="w-[35rem] relative h-screen overflow-hidden overflow-y-auto bg-white dark:bg-gray-900 flex-col left-menu-scroll flex gap-2">
      <div className="w-full flex justify-between items-center p-4 ">
        <span className="flex gap-4 w-fit  items-center  ">
          <h3 className="text-black font-medium text-xl dark:text-white tracking-wide">
            Messages
          </h3>
          <span className="bg-pink-500 text-xs flex items-center justify-center  text-black dark:text-white text-center font-normal rounded-full h-5 w-5 ">
            {totalUnseenMessage}
          </span>
        </span>
        <button
          className="font-medium tracking-wide bg-white p-1 rounded-sm text-blue-500"
          onClick={() => setOpenFriendList(!openFriendList)}
        >
          {openFriendList ? "Go back" : "Find Friends"}
        </button>
      </div>
      {openFriendList ? (
        <>
          <div className="w-full flex px-4 ">
            <input
              type="text"
              className="w-full focus:outline-blue-500 px-2 py-1 border rounded-md "
              placeholder="Search all friends..."
              name="search"
              value={searchAllText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearchAllText(e.target.value);
              }}
            />
          </div>
          <div className="h-fit flex flex-col px-4 ">
            {allFriendList?.map((item: any, index: number) => {
              return (
                <div
                  className={` ${
                    activeChat === item?._id
                      ? "!bg-gradient-to-r !from-[#f973162b] !to-transparent !border-orange-500"
                      : ""
                  } w-full p-4 flex flex-row items-center  gap-2 cursor-pointer border-l-4 border-transparent  border-b !border-b-gray-200/10 hover:border-orange-500 bg-gradient-to-r from-transparent to-transparent hover:from-[#f973162b] hover:to-transparent transition-all ease-in-out duration-300 `}
                  key={item?._id}
                  onClick={() => {
                    setConversationId(item?._id);
                    handleRoomJoin(item?._id);
                    setActiveChat(item?._id);
                    setReceiverUser(item?.friend);
                  }}
                >
                  <div className="">
                    <Avatar
                      src={item?.friend?.profileImage}
                      name={item?.friend?.name}
                    />
                  </div>
                  <div className="flex flex-row items-center justify-between w-full ">
                    <span className="flex flex-col  items-baseline">
                      <h3 className="text-black dark:text-white font-medium text-base tracking-wide">
                        {item?.friend?.name}
                      </h3>
                      <small
                        className={`text-black dark:text-gray-50/80 ${
                          user?._id === item?.message?.sender
                            ? "font-normal"
                            : "font-bold"
                        }  tracking-wide`}
                      >
                        {item?.friend?.status}
                      </small>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="w-full flex px-4 ">
            <input
              type="text"
              className="w-full focus:outline-blue-500 px-2 py-1 border rounded-md "
              placeholder="Search a friend..."
              name="search"
              value={searchText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setSearchText(e.target.value);
              }}
            />
          </div>
          <div className="h-fit flex flex-col  ">
            {filteredSearchFriend?.map((item: any, index: number) => {
              return (
                <div
                  className={` ${
                    activeChat === item?._id
                      ? "!bg-gradient-to-r !from-[#f973162b] !to-transparent !border-orange-500"
                      : ""
                  } w-full p-4 flex flex-row items-center  gap-2 cursor-pointer border-l-4 border-transparent  border-b !border-b-gray-200/10 hover:border-orange-500 bg-gradient-to-r from-transparent to-transparent hover:from-[#f973162b] hover:to-transparent transition-all ease-in-out duration-300 `}
                  key={item?._id}
                  onClick={() => {
                    setConversationId(item?._id);
                    handleRoomJoin(item?._id);
                    setActiveChat(item?._id);
                    setReceiverUser(item?.user);
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
        </>
      )}
    </div>
  );
};

export default LeftMenu;
