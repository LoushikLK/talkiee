const router = require("express").Router();
const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");

router.get("/", auth, async (req, res) => {
  try {
    // console.log("at self");

    const user = await userSchema.findById(req.user.id);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        data: {},
        error: "User not found",
      });
    }

    res.status(200).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isOnline: user.isOnline,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        status: user.status,
        gender: user.gender,
        phone: user.phone,
      },
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
      error: error,
    });
  }
});

module.exports = router;
