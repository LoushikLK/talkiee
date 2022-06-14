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
          };
          socket.token = token;
          return next();
        } else {
          console.log("user not found");
          return next(new Error("Invalid session"));
        }
      } else {
        console.log("invalid token");
        return next(new Error("Invalid token"));
      }
    }
    console.log("no token");
    return next(new Error("No token"));
  } catch (error) {
    next(new Error(error.message));
  }
};

module.exports = auth;
