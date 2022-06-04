const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken || req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
        data: {},
        error: "Unauthorized",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "You are not logged in",
        data: {},
        error: "Unauthorized",
      });
    }

    // console.log(decoded);

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
