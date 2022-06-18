import LeftMenu from "./LeftMenu";
import Lottie from "react-lottie";
import { statusAnimation } from "assets/animations";

const Feed = () => {
  const animationOption = {
    loop: true,
    autoplay: true,
    animationData: statusAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full flex items-start ">
      <LeftMenu />
      <div className="w-full flex h-screen items-center justify-center">
        <div className="w-[400px] flex flex-col items-center gap-4 ">
          <Lottie options={animationOption} height={300} width={300} />

          <small className="text-base font-medium tracking-wide text-center text-gray-900 dark:text-gray-500">
            Click on contact to see their status
          </small>
        </div>
      </div>
    </div>
  );
};

export default Feed;
