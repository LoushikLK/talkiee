import Lottie from "react-lottie";
import LeftMenu from "./LeftMenu";
import { newMessageAnimation } from "assets/animations";

const Home = () => {
  const newMessageOption = {
    loop: true,
    autoplay: true,
    animationData: newMessageAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section className="bg-white dark:bg-gray-900 flex-row flex h-screen overflow-hidden ">
      <LeftMenu />
      <div className="w-full flex flex-col  bg-white dark:bg-slate-700 px-4 pt-4 relative items-center justify-center ">
        <span className="w-fit h-fit flex items-center gap-4  flex-col">
          <Lottie options={newMessageOption} height={350} width={350} />
          <small className="text-white tracking-wide text-center">
            Send and receive messages by clicking on the person you want to chat
            with or by clicking on the plus icon in the top right corner.
          </small>
        </span>
      </div>
    </section>
  );
};

export default Home;
