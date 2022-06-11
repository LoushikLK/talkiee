import { NavLink } from "react-router-dom";
import { Chat, Gallery, Group, Setting } from "assets/icons";
import { Avatar } from "components/core";

const Navbar = () => {
  const navMenu = [
    {
      key: "1",
      name: "Chat",
      path: "/",
      icon: (
        <Chat className="text-white !text-[2rem] transition-all ease-in-out duration-300" />
      ),
    },
    {
      key: "2",
      name: "Groups",
      path: "/groups",
      icon: (
        <Group className="text-white !text-[2rem] transition-all ease-in-out duration-300" />
      ),
    },
    {
      key: "3",
      name: "Status",
      path: "/status",
      icon: (
        <Gallery className="text-white !text-[2rem] transition-all ease-in-out duration-300" />
      ),
    },
    {
      key: "4",
      name: "Profile",
      path: "/profile",
      icon: (
        <Avatar
          src="https://avatars.dicebear.com/api/avataaars/india.svg"
          size="small"
        />
      ),
    },
  ];

  return (
    <nav className=" p-4 ">
      <div className="h-full flex flex-col gap-4 bg-cyan-500 w-fit rounded-3xl ">
        <div className=" text-white text-4xl h-fit p-2 pt-8 flex items-center justify-center ">
          <Avatar src="https://avatars.dicebear.com/api/identicon/india.svg" />
        </div>
        <div className="flex flex-col h-full p-8 justify-between">
          <div className="flex gap-8 flex-col items-center">
            {navMenu.map((item) => {
              return (
                <span key={item?.key} className="">
                  <NavLink to={item?.path}>{item?.icon}</NavLink>
                </span>
              );
            })}
          </div>
          <div className="flex justify-center  animate-spin-slow ">
            <span className="">
              <NavLink to="/settings">
                <Setting className="text-white text-3xl" />
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
