const auth = require("../../middleware/auth");

const router = require("express").Router();

const groupConversation = require("../../models/groupConversation");

const groupMessage = require("../../models/groupMessage");

//post message to group conversation

router.post("/", auth, async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    const user = req.user.id;

    //check message conversation exist or not

    const conversation = await groupConversation.findById(conversationId);

    if (!conversation) {
      return res.status(400).json({
        error: "Conversation not found",
        data: {},
        message: "Conversation not found",
      });
    }

    //then send message to group conversation

    const newMessage = new groupMessage({
      conversationId: conversationId,
      sender: user,
      seen: [],
      message: message,
      react: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
      error: error.message,
      data: {},
      message: "Error in sending message",
    });
  }
});

router.get("/:conversationId", auth, async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const user = req.user.id;

    const conversation = await groupConversation.findById(conversationId);

    if (!conversation) {
      return res.status(400).json({
        error: "Conversation not found",
        data: {},
        message: "Conversation not found",
      });
    }

    const messages = await groupMessage
      .find({
        conversationId: conversationId,
      })
      .sort({ createdAt: 1 })
      .limit(50);

    if (!messages) {
      return res.status(400).json({
        error: "Message not found",
        data: {},
        message: "Message not found",
      });
    }

    return res.status(200).json({
      error: null,
      data: messages,
      message: "Message found",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      data: {},
      message: "Error in getting message",
    });
  }
});

module.exports = router;
