import { User } from "types";

export type userActionType = {
  type: "USER-DETAIL" | "USER-LOGOUT" | "SET-USER";
  payload: User;
};
