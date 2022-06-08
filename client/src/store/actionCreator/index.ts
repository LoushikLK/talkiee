import { User } from "types";
import { userActionType } from "./type";

export const userDetails = (user: User) => {
  return (dispatch: any) => {
    dispatch({
      type: "USER-DETAIL",
      payload: user,
    });
  };
};

export const setUser = (user: User) => {
  return (dispatch: any) => {
    dispatch({
      type: "SET-USER",
      payload: user,
    });
  };
};

export const userLogout = () => {
  return (dispatch: any) => {
    dispatch({
      type: "USER-LOGOUT",
      payload: {
        _id: "",
        name: "",
        email: "",
        profileImage: "",
        phone: "",
        coverImage: "",
        status: "",
        gender: "",
      },
    });
  };
};
