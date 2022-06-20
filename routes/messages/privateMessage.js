const { default: mongoose } = require("mongoose");
const auth = require("../../middleware/auth");
const router = require("express").Router();
const conversationModel = require("../../models/conversation");
const messageModel = require("../../models/messages");
const userModel = require("../../models/user");

//send message to a user

router.post("/", auth, async (req, res) => {
  try {
    const { receiver, message } = req.body;
    const user = req.user.id;

    //check message conversation exist or not

    const conversation = await conversationModel.aggregate([
      {
        $match: {
          $or: [
            {
              members: {
                $all: [user, receiver],
              },
            },
            {
              members: {
                $all: [receiver, user],
              },
            },
          ],
        },
      },
    ]);

    // console.log("conversation", conversation);

    if (!conversation) {
      //create new conversation if not exist

      const newConversation = new conversationModel({
        members: [user, receiver],
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
      const user1 = await userModel.findByIdAndUpdate(
        user,
        {
          $push: saveConversation._id,
        },
        {
          new: true,
        }
      );
      const user2 = await userModel.findById(
        receiver,
        {
          $push: saveConversation._id,
        },
        {
          new: true,
        }
      );

      if (!user1 || !user2) {
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

    const newMessage = new messageModel({
      conversationId: conversation[0]._id,
      sender: user,
      receiver: receiver,
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

router.get("/:userId", auth, async (req, res) => {
  try {
    const user = req.user.id;
    const otherUser = req.params.userId;

    const conversation = await conversationModel.aggregate([
      {
        $match: {
          $or: [
            {
              members: {
                $all: [user, otherUser],
              },
            },
            {
              members: {
                $all: [otherUser, user],
              },
            },
          ],
        },
      },
    ]);

    if (!conversation) {
      return res.status(200).json({
        error: "Conversation not exist",
        data: [],
        message: "Conversation not exist",
      });
    }

    //get last 50 messages from a conversation
    const messages = await messageModel
      .find({
        conversationId: conversation[0]._id,
      })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

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

router.post("/seen", auth, async (req, res) => {
  try {
    const receiver = req.user.id;
    const sender = req.body.sender;

    console.log({ receiver });
    console.log({ sender });

    const message = await messageModel.updateMany(
      {
        receiver: mongoose.Types.ObjectId(receiver),
        sender: mongoose.Types.ObjectId(sender),
        seen: false,
      },
      {
        seen: true,
      },
      {
        multi: true,
      }
    );

    if (!message) {
      return res.status(400).json({
        error: "Message not seen",
        data: {},
        message: "Message not seen",
      });
    }

    return res.status(200).json({
      error: null,
      data: {},
      message: "Message seen",
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
