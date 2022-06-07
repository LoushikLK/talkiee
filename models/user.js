const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    indexes: true,
  },
  countryCode: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  blocked: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      phone: {
        type: String,
        required: true,
      },
    },
  ],
  isOnline: {
    type: Boolean,
    default: false,
  },
  profileImage: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  status: {
    type: String,
    default: "Hey there, I am using ChatApp",
  },
  gender: {
    type: String,
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  createdAt: {
    type: Number,
  },
  updatedAt: Number,
});

registerSchema.pre("save", function (next) {
  this.createdAt = Date.now();
  next();
});

const userModel = mongoose.model("users", registerSchema);

module.exports = userModel;
