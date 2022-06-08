const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    // console.log(token);

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
        data: {},
        error: "Unauthorized",
      });
    }

    const bearerToken = token.split(" ")[1];

    const decoded = await jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "You are not logged in",
        data: {},
        error: "Unauthorized",
      });
    }

    // console.log(decoded);
    // console.log("running auth middleware");

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "You are not logged in",
      data: {},
      error: "Unauthorized",
    });
  }
};

module.exports = auth;
