const { Router } = require("express");
const bcrypt = require("bcrypt");
const userModel = require("../../models/user");
const checkUser = require("../../utils/firebaseConfig");

const router = Router();

const saltRound = 10;

router.post("/", checkUser, async (req, res) => {
  try {
    const { newPassword, phoneNumber } = req.body;

    if (!newPassword || !phoneNumber) {
      throw new Error(`Please provide a new password and a phone number`);
    }

    const phoneExist = await userModel
      .findOne({
        phone: phoneNumber,
      })
      .lean();

    if (!phoneExist) {
      throw new Error(`Phone number does not exist.`);
    }

    const newHashPassword = await bcrypt.hash(newPassword, saltRound);

    if (!newHashPassword) {
      throw new Error(`Could not hash password`);
    }

    const updatePassword = await userModel?.findByIdAndUpdate(
      phoneExist?._id,
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
