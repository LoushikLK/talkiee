import { User } from "types";
import { userActionType } from "./type";

export const userDetails = (user: User) => {
  return (dispatch: (arg0: userActionType) => void) => {
    dispatch({
      type: "USER-DETAIL",
      payload: user,
    });
  };
};
