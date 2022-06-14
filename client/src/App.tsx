import { PrivateRoutes, PublicRoutes } from "routes";
import { userSelf } from "config/path";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SELECTOR_TYPE, User } from "types";
import { actionCreators } from "store";
import "react-phone-number-input/style.css";
import "./App.css";
import Lottie from "react-lottie";
import { loadingAnimations } from "assets/animations";
import SocketContextProvider from "config/SocketContextProvider";

function App() {
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const user = useSelector((state: SELECTOR_TYPE) => state.userDetail);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    let getUserDetails = async () => {
      const response = await fetch(userSelf, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // console.log(data);
      if (response.status === 200) {
        dispatch(actionCreators.setUser(data?.data) as any);
      }
      setLoading(false);
    };
    getUserDetails();
  }, []);

  const loadingAnimationOption = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimations,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      {loading ? (
        <div className="w-full min-h-screen h-full flex items-center justify-center">
          <Lottie options={loadingAnimationOption} height={350} width={350} />
        </div>
      ) : user?._id ? (
        <PrivateRoutes />
      ) : (
        <PublicRoutes />
      )}
    </>
  );
}

export default App;
