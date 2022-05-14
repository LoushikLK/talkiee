const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    res.json({
      message: "Post Feed",
    });
  } catch (error) {
    console.log(error);
  }
});
