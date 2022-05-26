const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: "number",
    default: Date.now(),
  },
  seen: {
    type: Boolean,
  },
});

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      name: {
        type: String,
      },
      phone: {
        type: String,
      },
    },
  ],
  messages: [
    {
      type: messageSchema,
    },
  ],
});

module.exports = mongoose.model("conversation", conversationSchema);
