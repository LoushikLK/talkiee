const { default: mongoose } = require("mongoose");
const userModel = require("../../models/user");

const getUserDetails = async (socket, userId) => {
  try {
    const user = userId;
    const userData = await userModel.findById(mongoose.Types.ObjectId(user));

    if (!userData) {
      return false;
    }

    let userDetails = {
      name: userData.name,
      email: userData.email,
      isOnline: userData.isOnline,
      lastSeen: userData.lastSeen,
      profileImage: userData.profileImage,
      _id: userData._id,
    };

    // console.log(`send details to ${socket.id}`);

    socket.to(socket.id).emit("user-details", userDetails);
  } catch (error) {
    console.log(error);

    return error;
  }
};

module.exports = getUserDetails;
