import { userActionType } from "store/actionCreator/type";
import { User } from "types";

const user: User = {
  id: "",
  name: "",
  email: "",
  profileImage: "",
  phone: "",
  coverImage: "",
  status: "",
  gender: "",
};

const reducer = (state = user, action: userActionType) => {
  if (action.type === "USER-DETAIL") {
    let user: User = {};

    let userDetails = async () => {
      const response = await fetch("/user/profile");
      const data = await response.json();
      (user.id = data?.data?._id)((user.name = data?.data?.name))(
        (user.email = data?.data?.email)
      )((user.profileImage = data?.data?.profileImage))(
        (user.phone = data?.data?.phone)
      )((user.coverImage = data?.data?.coverImage))(
        (user.status = data?.data?.status)
      )((user.gender = data?.data?.gender));
      return user;
    };

    userDetails();

    return {
      ...user,
    };
  } else {
    return state;
  }
};

export default reducer;
