const { Router } = require("express");

const userModel = require("../../models/user");
const checkUser = require("../../utils/firebaseConfig");
const jwtCreate = require("../../utils/jwtCreate");
const bcrypt = require("bcrypt");

const router = Router();

router.post("/", async (req, res) => {
  try {
    // console.log("req.body", req.body);

    const { phone, password } = req.body;

    const phoneExist = await userModel.findOne({
      phone,
    });

    // console.log("phoneExist", phoneExist);

    if (!phoneExist) {
      return res.status(400).json({
        message: "Credentials are not correct",
        data: {},
        error: "Incorrect Credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      phoneExist.password
    );

    // console.log("isPasswordCorrect", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Credentials are not correct",
        data: {},
        error: "Incorrect Credentials ",
      });
    }

    const token = await jwtCreate(phoneExist);

    // console.log(token);

    res
      .cookie("authToken", token)
      .status(200)
      .json({
        data: {
          token,
          data: {
            _id: phoneExist?._id,
            name: phoneExist?.name,
            email: phoneExist?.email,
            isOnline: phoneExist?.isOnline,
            profileImage: phoneExist?.profileImage,
            coverImage: phoneExist?.coverImage,
            status: phoneExist?.status,
            gender: phoneExist?.gender,
            phone: phoneExist?.phone,
          },
        },
        message: "User logged in successfully",
        error: "",
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong, please try again",
      error: error,
      data: {},
    });
  }
});

module.exports = router;
