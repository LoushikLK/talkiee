import React from "react";
import LeftMenu from "./LeftMenu";

const Home = () => {
  return (
    <section className="bg-white dark:bg-gray-900 flex-row flex gap-4">
      <LeftMenu />
      <div className="w-full bg-white  ">home</div>
    </section>
  );
};

export default Home;
