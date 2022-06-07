const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const postModel = require("../../models/post");

const fileUploader = require("../../middleware/fileUploader");

router.post("/", auth, async (req, res) => {
  try {
    const { file, caption } = req.body;
    const { id } = req.user;

    console.log(req.upload);

    console.log(req.file);
    // const postData = new postModel({
    //   user: id,
    //   post: {
    //     url: post?.url,
    //     refUrl: post?.refUrl,
    //     caption: post?.caption,
    //   },
    //   createdAt: Date.now(),
    //   expiresAt: Date.now() + 20000,
    // });

    // const savedPost = await postData.save();

    // if (!savedPost) {
    //   return res.status(400).send({
    //     error: "Post could not be saved",
    //     message: "Post could not be saved",
    //     data: {},
    //   });
    // }

    return res.status(200).send({
      message: "Post saved successfully",
      data: {
        post: "",
      },
      error: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
      data: {},
      error: "Internal server error",
    });
  }
});
router.get("/", auth, async (req, res) => {
  try {
    console.log(req.user);
    console.log(Date.now());

    res.json({
      message: "Post Feed",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
