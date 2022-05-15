const { Router } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkUser = require("../../utils/firebaseConfig");

const registerValidationSchema = require("../../middleware/registerValidation");

const registrationModel = require("../../models/register");
const jwtCreate = require("../../utils/jwtCreate");

const router = Router();

const saltRound = 10;

router.post("/", checkUser, registerValidationSchema, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: errors.array().map((e) => e.msg) });
    }

    const { name, phone, email, password, gender } = req.body;

    const phoneExist = await registrationModel.findOne({
      phone,
    });
    const emailExist = await registrationModel.findOne({
      email,
    });
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

    const userData = new registrationModel({
      name,
      phone,
      password: hashPassword,
      email,
      gender,
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
      error: error,
      data: {},
    });
  }
});

module.exports = router;
