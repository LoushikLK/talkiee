const jwt = require("jsonwebtoken");

const jwtCreate = async (user) => {
  try {
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        phone: user.phone,
        profileImage: user.profileImage,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    );

    return token;
  } catch (error) {
    console.log(error);
  }
};

module.exports = jwtCreate;
