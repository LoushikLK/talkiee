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
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  profileImage: {
    type: String,
  },
  profileImageRef: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  status: {
    type: String,
    default: "Hey there, I am using Talkiee",
  },
  gender: {
    type: String,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  createdAt: {
    type: Number,
  },
  updatedAt: Number,
});

const userModel = mongoose.model("users", registerSchema);

module.exports = userModel;
