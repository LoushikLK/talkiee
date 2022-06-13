const { default: mongoose } = require("mongoose");
const auth = require("../../middleware/auth");
const router = require("express").Router();
const conversationModel = require("../../models/conversation");
const messageModel = require("../../models/messages");
const userModel = require("../../models/user");

//send message to a user

router.post("/:conversationId", auth, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;
    const user = req.user.id;

    //check message id exist or not

    const conversation = await conversationModel.findById(conversationId);

    // console.log("conversation", conversation);

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found",
        data: {},
        message: "Conversation not found",
      });
    }

    const to = conversation?.members?.find((member) => member !== user);

    const newMessage = new messageModel({
      conversationId: conversationId,
      sender: user,
      receiver: to,
      message,
      createdAt: Date.now(),
      seen: false,
      delivered: false,
    });

    const saveMessage = await newMessage.save();

    if (!saveMessage) {
      return res.status(400).json({
        error: "Message not sent",
        data: {},
        message: "Message not sent",
      });
    }

    return res.status(200).json({
      error: null,
      data: saveMessage,
      message: "Message sent",
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

//get message from a conversation

router.get("/:conversationId", auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await conversationModel.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        error: "Conversation not found",
        data: {},
        message: "Conversation not found",
      });
    }

    //get last 50 messages from a conversation
    const messages = await messageModel
      .find({
        conversationId: conversationId,
      })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      error: null,
      data: messages,
      message: "Messages fetched",
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

//create a new conversation

router.post("/create/:userId", auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user.id;

    console.log(userId);
    console.log(user);

    const conversation = await conversationModel.findOne({
      $or: [
        {
          members: { $all: [user, userId] },
        },
        {
          members: { $all: [userId, user] },
        },
      ],
    });

    if (!conversation) {
      const newConversation = new conversationModel({
        members: [user, userId],
      });

      const saveConversation = await newConversation.save();

      if (!saveConversation) {
        return res.status(400).json({
          error: "Conversation not created",
          data: {},
          message: "Conversation not created",
        });
      }

      //then save both users in each other's conversation
      const user1 = await userModel.findById(user);
      const user2 = await userModel.findById(userId);

      // console.log(user1);
      // console.log(user2);

      user1?.conversations?.push(saveConversation._id);
      user2?.conversations?.push(saveConversation._id);

      // console.log(user1);
      // console.log(user2);

      const saveUser1 = await user1.save();
      const saveUser2 = await user2.save();

      if (!saveUser1 || !saveUser2) {
        return res.status(400).json({
          error: "Conversation not created",
          data: {},
          message: "Conversation not created",
        });
      }

      return res.status(200).json({
        error: null,
        data: saveConversation,
        message: "Conversation created",
      });
    }
    return res.status(200).json({
      error: null,
      data: conversation,
      message: "Conversation already exists",
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
