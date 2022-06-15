const { default: mongoose } = require("mongoose");
const registrationModel = require("../../models/user");

const setOnline = async (userId, socket) => {
  try {
    const user = userId;
    const userData = await registrationModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(user),
      {
        isOnline: true,
      },
      { new: true }
    );
    if (!userData) {
      return false;
    }

    console.log(userData?.name + " is online");

    return true;
  } catch (error) {
    console.log(error);

    console.log("error in setOnline");
    console.log("user is not logged in");
    socket.disconnect(true);
  }
};

module.exports = setOnline;
