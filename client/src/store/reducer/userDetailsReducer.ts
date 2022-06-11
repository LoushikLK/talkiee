import { userActionType } from "store/actionCreator/type";
import { User } from "types";

const user: User = {
  _id: "",
  name: "",
  email: "",
  profileImage: "",
  phone: "",
  coverImage: "",
  status: "",
  gender: "",
};

const reducer = (state = user, action: userActionType) => {
  // console.log(token);
  console.log(action.type);

  console.log(action.payload);

  if (action.type === "USER-DETAIL") {
    return {
      ...user,
    };
  } else if (action.type === "SET-USER") {
    // console.log("running");
    return {
      ...action.payload,
    };
  } else if (action.type === "USER-LOGOUT") {
    return {
      ...user,
    };
  }
  return state;
};

export default reducer;
