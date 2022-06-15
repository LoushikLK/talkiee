const userModel = require("../../models/user");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const setOffline = async (userId, socket) => {
  try {
    const user = userId;
    const userData = await userModel.findByIdAndUpdate(
      mongoose.Types.ObjectId(user),
      {
        isOnline: false,
        lastSeen: new Date(),
      },
      { new: true }
    );

    if (!userData) {
      return false;
    }
    // console.log(`user ${user} is offline`);
    socket.disconnect(true);

    console.log(userData?.name + " is offline");

    return true;
  } catch (error) {
    // console.log(error);
    console.log("error in setOffline");
    socket.disconnect(true);
  }
};

module.exports = setOffline;
