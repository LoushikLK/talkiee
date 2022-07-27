const { Router } = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../../models/user");
const auth = require("../../middleware/auth");

const router = Router();

const saltRound = 10;

router.post("/", auth, async (req, res) => {
  try {
    const userId = req.user?.id;

    const { oldPassword, newPassword } = req.body;

    if (oldPassword === newPassword) {
      throw new Error(`New password and old password can not be equal`);
    }

    const userData = await userModel.findById(userId);

    if (!userData) {
      throw new Error(`User  does not exist`);
    }

    const checkPassword = await bcrypt.compare(oldPassword, userData?.password);

    if (!checkPassword) {
      throw new Error(`Old password does not match`);
    }

    const newHashPassword = await bcrypt.hash(newPassword, saltRound);

    if (!newHashPassword) {
      throw new Error(`Could not hash password`);
    }

    const updatePassword = await userModel?.findByIdAndUpdate(
      userId,
      { password: newHashPassword },
      {
        new: true,
      }
    );

    if (!updatePassword) {
      throw new Error(`Could not update password`);
    }

    res.status(200).json({
      message: `Password updated successfully`,
      data: {},
      error: "",
    });
  } catch (error) {
    res.status(404).json({
      message: "Error changing password",
      data: {},
      error: error?.message,
    });
  }
});

module.exports = router;
