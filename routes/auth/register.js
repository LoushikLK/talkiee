const { Router } = require("express");
const bcrypt = require("bcrypt");
const checkUser = require("../../utils/firebaseConfig");
const userModel = require("../../models/user");
const jwtCreate = require("../../utils/jwtCreate");

const router = Router();

const saltRound = 10;

router.post("/", checkUser, async (req, res) => {
  try {
    // console.log("register");
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res
    //     .status(422)
    //     .json({ message: errors.array().map((e) => e.msg) });
    // }

    const { name, phone, email, password, gender } = req.body;

    const phoneExist = await userModel
      .findOne({
        phone,
      })
      .lean();
    const emailExist = await userModel
      .findOne({
        email,
      })
      .lean();
    if (phoneExist) {
      return res.status(401).json({
        message: "Phone number already exist. Please login",
      });
    }
    if (emailExist) {
      return res.status(401).json({
        message: "Email already exist. Try another email",
      });
    }

    const hashPassword = await bcrypt.hash(password, saltRound);

    const userData = new userModel({
      name,
      phone,
      password: hashPassword,
      email,
      gender: gender?.toLowerCase(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      coverImage: "",
      profileImage: "",
      isOnline: true,
      blocked: [],
    });

    const savedUser = await userData.save();
    // console.log(savedUser);

    const token = await jwtCreate(savedUser);

    res.cookie("authToken", token).status(200).json({
      data: {
        token,
      },
      message: "User registered successfully",
      error: "",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Something went wrong, please try again",
      error: error?.message,
      data: {},
    });
  }
});

module.exports = router;
