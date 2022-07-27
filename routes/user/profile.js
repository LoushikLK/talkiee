const router = require("express").Router();
const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");
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

router.get("/:id", auth, async (req, res) => {
  try {
    // console.log("at self");
    const { id } = req.params;

    const user = await userSchema.findById(id).lean();

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        data: {},
        error: "User not found",
      });
    }

    res.status(200).json({
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isOnline: user.isOnline,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        status: user.status,
        gender: user.gender,
        phone: user.phone,
      },
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      data: {},
      error: error,
    });
  }
});

router.post("/update", auth, upload.single("file"), async (req, res) => {
  try {
    const { status, name } = req.body;

    const user = req.user.id;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      const updateUser = await userSchema.findByIdAndUpdate(user, {
        status: status,
        name: name,
        profileImage: result?.url,
        profileImageRef: result?.public_id,
      });

      if (!updateUser) {
        return res.status(400).json({
          message: "Couldn't update user",
          data: {},
          error: "Couldn't update user",
        });
      }

      return res.status(200).json({
        message: "Success",
        data: {},
        error: "",
      });
    }

    const updateUser = await userSchema.findByIdAndUpdate(user, {
      status: status,
      name: name,
    });

    if (!updateUser) {
      return res.status(400).json({
        message: "Couldn't update user",
        data: {},
        error: "Couldn't update user",
      });
    }

    res.status(200).json({
      message: "Success",
      data: {},
      error: "",
    });
  } catch (error) {
    // console.log(error);
    return res.status(400).json({
      message: "Couldn't update user",
      data: {},
      error: error?.message,
    });
  }
});

module.exports = router;
