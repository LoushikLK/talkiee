const multer = require("multer");
const cloudinary = require("cloudinary").v2;

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const fileUploader = async (req, res, next) => {
  try {
    upload.single(req.file);

    const result = await cloudinary.uploader.upload(req.file.path);

    if (!result) {
      return res.status(400).send({
        error: "File could not be uploaded",
        message: "File could not be uploaded",
        data: {},
      });
    }

    req.upload = result;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      data: {},
      error: "Internal server error",
    });
  }
};

module.exports = fileUploader;
