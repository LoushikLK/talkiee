const registrationModel = require("../../models/register");
const jwt = require("jsonwebtoken");

const setOnline = async (auth, socket) => {
  try {
    const token = auth;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      console.log("Invalid token");
      return socket.disconnect(true);
    }
    const { id } = decoded;
    const updateUser = await registrationModel.findByIdAndUpdate(id, {
      isOnline: true,
    });
  } catch (error) {
    // console.log(error);
    console.log("user is not logged in");
    socket.disconnect(true);
  }
};

module.exports = setOnline;
