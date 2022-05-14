const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registrationModel = require("../../models/register");

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { phone, email, password } = req.body;

    const phoneExist = await registrationModel.findOne({
      phone,
    });
    const emailExist = await registrationModel.findOne({
      email,
    });

    if (!phoneExist || !emailExist) {
      return res.status(400).json({
        message: "Credentials are not correct",
        data: {},
        error: "Incorrect Credentials",
      });
    }

    let userExist = phoneExist || emailExist;

    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Credentials are not correct",
        data: {},
        error: "Incorrect Credentials",
      });
    }

    const token = await jwt.sign(
      {
        id: userExist._id,
        name: userExist.name,
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
