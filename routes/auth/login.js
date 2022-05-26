const { Router } = require("express");

const registrationModel = require("../../models/register");
const checkUser = require("../../utils/firebaseConfig");
const jwtCreate = require("../../utils/jwtCreate");

const router = Router();

router.post("/", checkUser, async (req, res) => {
  try {
    const { phone } = req.body;

    const phoneExist = await registrationModel.findOne({
      phone,
    });

    if (!phoneExist) {
      return res.status(400).json({
        message: "Credentials are not correct",
        data: {},
        error: "Incorrect Credentials",
      });
    }

    const token = await jwtCreate(phoneExist);

    // console.log(token);

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
