const jwt = require("jsonwebtoken");

const jwtVerify = async (token) => {
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      console.log("Invalid token");
      return false;
    }
    return decoded;
  } catch (error) {
    console.log(error);
  }
};

module.exports = jwtVerify;
