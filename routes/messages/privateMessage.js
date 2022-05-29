const auth = require("../../middleware/auth");
const router = require("express").Router();
const conversationModel = require("../../models/messages");

router.post("/", auth, async (req, res) => {
  try {
    console.log("post to message");
    const { to } = req.body;
    const { message } = req.body;
    const user = req.user.id;

    const checkToUser = await conversationModel.findById(to);

    if (!checkToUser) {
      return res.status(400).json({
        message: "User not found",
        data: null,
        error: "BAD REQUEST",
      });
    }

    // console.log(user + " " + to + " " + message);

    const newMessage = new conversationModel({
      participants: [user, to],
      sender: user,
      receiver: to,
      message,
      createdAt: Date.now(),
      seen: false,
    });

    const messageSent = await newMessage.save();

    // console.log(messageSent, " message sent");

    if (!messageSent) {
      return res.status(400).json({
        message: "Message not sent",
        data: {},
        error: "Bad Request",
      });
    }
    res.status(200).json({
      message: "message sent",
      data: messageSent,
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

router.get("/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user.id;

    const conversation = await conversationModel
      .find({
        participants: {
          $all: [user, userId],
        },
      })
      .limit(20)
      .populate("participants");

    if (!conversation) {
      return res.status(200).json({
        message: "No conversation found",
        data: {},
        error: "Bad Request",
      });
    }
    res.status(200).json({
      message: "Conversation found",
      data: conversation,
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
