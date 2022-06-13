const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
    },
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
  },
  {
    timestamps: true,
  }
);

messageSchema.index({ timestamps: 1 }).pre("save", function (next) {
  next();
});

const message = mongoose.model("message", messageSchema);

module.exports = message;
