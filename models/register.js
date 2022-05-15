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
    type: "String",
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  createdAt: {
    type: "number",
  },
  updatedAt: "Number",
});

const registerModel = mongoose.model("users", registerSchema);

module.exports = registerModel;
