const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    members: {
      type: Array,
    },
    createdAt: {
      type: "number",
      default: Date.now(),
    },
    updatedAt: {
      type: "number",
      default: Date.now(),
    },
    groupImage: {
      type: String,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
    groupAdmin: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("group", ConversationSchema);
