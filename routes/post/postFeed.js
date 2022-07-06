const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const postModel = require("../../models/post");
const contactModel = require("../../models/contacts");

const multer = require("multer");
const { default: mongoose } = require("mongoose");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        data: {},
        error: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const user = req.user.id;

    //access contacts of user

    const contacts = await contactModel.findOne({ user: user }).lean();

    //create post

    const viewers = contacts?.contacts.map((contact) => {
      if (contact.viewStatus) {
        return {
          _id: contact._id,
          seen: false,
        };
      }
    });

    const post = new postModel({
      user: user,
      post: {
        url: result.url,
        refUrl: result.public_id,
        caption: req.body.caption,
      },
      viewers: viewers,
    });

    const savedPost = await post.save();

    if (!savedPost) {
      return res.status(400).json({
        message: "Post not saved",
        data: {},
        error: "Post not saved",
      });
    }

    return res.status(200).json({
      message: "Post saved",
      data: {
        post: {
          url: result.url,
        },
        postId: savedPost._id,
      },
      error: null,
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
    const user = req.user.id;

    //access status of other users in contacts

    const status = await postModel.aggregate([
      {
        $match: {
          viewers: {
            $elemMatch: {
              _id: mongoose.Types.ObjectId(user),
            },
          },
        },
      },
    ]);

    if (!status) {
      return res.status(200).json({
        message: "No status",
        data: {
          status: [],
        },
        error: null,
      });
    }

    return res.status(200).json({
      message: "Status fetched",
      data: {
        status: status,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
