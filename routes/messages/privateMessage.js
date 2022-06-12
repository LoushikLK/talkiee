const { default: mongoose } = require("mongoose");
const auth = require("../../middleware/auth");
const router = require("express").Router();
const conversationModel = require("../../models/messages");
const userModel = require("../../models/user");

router.post("/", auth, async (req, res) => {
  try {
    // console.log("post to message");

    // console.log(req.body);

    const { to } = req.body;
    const { message } = req.body;
    const user = req.user.id;

    const checkToUser = await userModel.findById(mongoose.Types.ObjectId(to));

    // console.log(checkToUser);

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
      delivered: false,
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

    // console.log(userId, user);

    // const conversation = await conversationModel
    //   .find({

    //   })
    //   .limit(20)
    //   .sort({ createdAt: 1 });

    const conversation = await conversationModel.find({
      $or: [
        {
          participants: [user, userId],
        },
        {
          participants: [userId, user],
        },
      ],
    });

    // console.log(conversation);

    if (!conversation) {
      return res.status(200).json({
        message: "No conversation found",
        data: {},
        error: "Bad Request",
      });
    }

    const conversationWithUser = await userModel.findById(userId);

    if (!conversationWithUser) {
      return res.status(200).json({
        message: "No conversation found",
        data: {},
        error: "Bad Request",
      });
    }

    let conversationWithUserDetails = {
      name: conversationWithUser.name,
      profileImage: conversationWithUser.profileImage,
      _id: conversationWithUser._id,
      isOnline: conversationWithUser.isOnline,
      phone: conversationWithUser.phone,
      gender: conversationWithUser.gender,
    };

    res.status(200).json({
      message: "Conversation found",
      data: {
        messages: conversation,
        user: conversationWithUserDetails,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      data: {},
      error: error.message,
    });
  }
});

module.exports = router;
