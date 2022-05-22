import React from "react";
import Navbar from "./Navbar";

type Props = {
  children?: React.ReactNode;
  title?: string;
};
const Layout = ({ children, title = "Talkiee" }: Props) => {
  document.title = title;
  return (
    <>
      <main className="w-full flex flex-row bg-white dark:bg-gray-900  ">
        <Navbar />
        <div className="flex-1 my-4">{children}</div>
      </main>
    </>
  );
};

export default Layout;
