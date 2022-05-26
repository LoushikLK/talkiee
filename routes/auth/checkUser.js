const { Router } = require("express");

const registrationModel = require("../../models/register");

const router = Router();

router.post("/", async (req, res) => {
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

    res.status(200).json({
      data: {},
      message: "User exists",
      error: false,
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
