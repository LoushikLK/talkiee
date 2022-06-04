const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
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
    required: true,
  },
  createdAt: {
    type: "number",
    default: Date.now(),
  },
  seen: {
    type: Boolean,
  },
  delivered: {
    type: Boolean,
  },
});

messageSchema.index({ participants: 1 }).pre("save", function (next) {
  next();
});

const message = mongoose.model("Message", messageSchema);

module.exports = message;
