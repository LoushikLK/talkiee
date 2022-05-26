const auth = require("../../middleware/auth");
const router = require("express").Router();
const userSchema = require("../../models/register");
const conversationSchema = require("../../models/messages");

router.post("/", auth, async (req, res) => {
  try {
    const { to } = req.body;
    const { message } = req.body;
    const user = req.user.id;

    const toUser = await userSchema.findById(to);

    if (!toUser) {
      return res.status(400).json({
        message: "User not found",
        data: {},
        error: "Bad Request",
      });
    }

    const conversationExist = await conversationSchema.findOne({
      participants: {
        $elemMatch: {
          id: user,
        },
        $elemMatch: {
          id: to,
        },
      },
    });

    // console.log("conversation", conversationExist);

    // console.log(to, message, user);

    if (!conversationExist) {
      const conversation = new conversationSchema({
        participants: [
          {
            id: user,
            name: req.user.name,
            phone: req.user.phone,
          },
          {
            id: to,
            name: toUser.name,
            phone: toUser.phone,
          },
        ],
        messages: [
          {
            sender: user,
            receiver: to,
            message,
            createdAt: Date.now(),
            seen: false,
          },
        ],
      });

      const conversationId = await conversation.save();
      await userSchema.updateMany(
        {
          _id: {
            $in: [user, to],
          },
        },
        {
          $push: {
            messages: conversationId,
          },
        },
        {
          new: true,
          multi: true,
        }
      );
      return res.status(200).json({
        message: "success",
        data: {
          user,
          message,
          user,
        },
        error: null,
      });
    }

    await conversationSchema.findOneAndUpdate(
      {
        _id: conversationExist._id,
      },
      {
        $push: {
          messages: {
            sender: user,
            receiver: to,
            message,
            createdAt: Date.now(),
            seen: false,
          },
        },
      }
    );

    res.status(200).json({
      message: "message exist",
      data: {
        user,
        message,
        user,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      data: {},
      error: error,
    });
  }
});

router.get("/:messageId", auth, async (req, res) => {
  try {
    const user = req.user.id;
    const { messageId } = req.params;

    const conversationExist = await conversationSchema.findOne({
      participants: {
        $elemMatch: {
          id: user,
        },
        $elemMatch: {
          id: messageId,
        },
      },
    });

    if (!conversationExist) {
      return res.status(400).json({
        message: "User not found",
        data: {},
        error: "Bad Request",
      });
    }

    await conversationSchema.findOneAndUpdate(
      {
        _id: conversationExist._id,
      },
      {
        $set: {
          "messages.$.seen": true,
        },
      }
    );

    res.status(200).json({
      message: "success",
      data: {
        user,
        messages: conversationExist.messages,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      data: {},
      error: error,
    });
  }
});

module.exports = router;
