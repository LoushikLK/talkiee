const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");
const router = require("express").Router();

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user.id;

    // console.log("get all friends");

    //for now  due to limited user showing all user available

    const users = await userSchema.find();

    if (!users) {
      return res.status(200).json({
        message: "No users found",
        data: {},
        error: "Bad Request",
      });
    }
    res.status(200).json({
      message: "Users found",
      data: users,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      data: {},
      error: error,
    });
  }
});

module.exports = router;