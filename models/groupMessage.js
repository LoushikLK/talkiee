const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
    },
    seen: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    message: {
      type: String,
    },
    react: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        reaction: String,
        createdAt: {
          type: "number",
          default: Date.now(),
        },
      },
    ],
    createdAt: {
      type: "number",
      default: Date.now(),
    },
    updatedAt: {
      type: "number",
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

const groupMessage = mongoose.model("groupMessage", groupMessageSchema);

module.exports = groupMessage;
