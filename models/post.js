const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
    post: {
      url: {
        type: String,
        required: true,
      },
      refUrl: {
        type: String,
      },
      caption: {
        type: String,
      },
    },
    viewers: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        seen: {
          type: Boolean,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expire_at: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ expire_at: 1 }, { expireAfterSeconds: 5 });

postSchema.pre("save", function (next) {
  next();
});

module.exports = mongoose.model("Post", postSchema);
