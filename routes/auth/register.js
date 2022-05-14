const { Router } = require("express");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerValidationSchema = require("../../middleware/registerValidation");

const registrationModel = require("../../models/register");

const router = Router();

const saltRound = 10;

router.post("/", registerValidationSchema, async (req, res) => {
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
        message: "Email already exist. Please login",
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

    const token = await jwt.sign(
      {
        id: savedUser._id,
        name: savedUser.name,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1m",
      }
    );

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
