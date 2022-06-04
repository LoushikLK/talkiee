const jwt = require("jsonwebtoken");
const userModel = require("../../models/user");
const jwtVerify = require("../../utils/jwtVerify");
const jwtCreate = require("../../utils/jwtCreate");

const auth = async function (socket, next) {
  try {
    const token = socket.handshake.auth.token;
    if (token) {
      const jwtToken = jwtVerify(token);
      if (jwtToken) {
        const session = await userModel.findById(jwtToken.id);
        if (session) {
          socket.user = {
            name: jwtToken.name,
            userId: jwtToken.id,
            email: jwtToken.email,
            profileImage: jwtToken.profileImage,
          };
          socket.userId = jwtToken.id;
          socket.name = jwtToken.name;
          socket.token = token;
          return next();
        } else {
          return next(new Error("Invalid session"));
        }
      } else {
        return next(new Error("Invalid token"));
      }
    }

    const user = socket.handshake.auth.user;
    if (!user) {
      return next(new Error("Invalid user"));
    }

    const session = await userModel.findById(user.id);

    const userObj = {
      name: user.name,
      id: user.id,
      email: user.email,
      profileImage: user.profileImage,
    };

    socket.user = userObj;
    socket.name = user.name;
    socket.userId = user.id;
    socket.token = jwtCreate(userObj);
    next();
  } catch (error) {
    next(new Error(error.message));
  }
};

module.exports = auth;
