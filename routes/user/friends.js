const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");
const router = require("express").Router();
const conversationSchema = require("../../models/conversation");
const messageSchema = require("../../models/messages");
const { default: mongoose } = require("mongoose");
const contacts = require("../../models/contacts");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user.id;

    // console.log(user);

    // console.log("fetching");

    const allConversations = await userSchema
      .findById(user)
      .populate("conversations");

    if (!allConversations) {
      return res.status(404).json({
        error: "Conversations not found",
        data: {},
        message: "Conversations not found",
      });
    }

    //after find conversations, find all messages of each conversation

    // console.log();

    const allData = await Promise.all(
      allConversations?.conversations?.map(async (conversation) => {
        const messages = await messageSchema
          .aggregate([
            {
              $match: {
                conversationId: mongoose.Types.ObjectId(conversation._id),
              },
            },
          ])
          .sort({ createdAt: -1 })
          .limit(1);

        const totalUnseenMessages = await messageSchema
          .aggregate([
            {
              $match: {
                conversationId: mongoose.Types.ObjectId(conversation._id),
                sender: { $ne: mongoose.Types.ObjectId(user) },
                seen: {
                  $eq: false,
                },
              },
            },
          ])
          .count("unseenMessages");

        // console.log(`totalUnseenMessages`, totalUnseenMessages);

        // console.log(messages);

        const userData = await userSchema.aggregate([
          {
            $match: {
              conversations: { $in: [messages[0]?.conversationId] },
              _id: { $ne: mongoose.Types.ObjectId(user) },
            },
          },
        ]);

        return {
          _id: conversation._id,
          message: messages[0],
          unseenMessages: totalUnseenMessages[0]?.unseenMessages || 0,
          user: {
            name: userData[0]?.name,
            profileImage: userData[0]?.profileImage,
            _id: userData[0]?._id,
            gender: userData[0]?.gender,
            lastSeen: userData[0]?.lastSeen,
          },
        };
      })
    );

    // console.log(`allData`, allData);

    return res.status(200).json({
      error: null,
      data: allData,
      message: "Friends list",
    });

    //find friends details and add to conversation
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      data: {},
      error: error,
    });
  }
});

router.get("/all", auth, async (req, res) => {
  try {
    const user = req.user.id;

    const getAllContacts = await contacts.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(user),
        },
      },
      {
        $unwind: "$contacts",
      },
      {
        $lookup: {
          as: "friend",
          from: "users",
          foreignField: "_id",
          localField: "contacts._id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                phone: 1,
                profileImage: 1,
                status: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          viewStatus: "$contacts.viewStatus",
        },
      },
      {
        $addFields: {
          _id: "$contacts._id",
        },
      },
      {
        $unwind: "$friend",
      },
      {
        $project: {
          _id: 1,
          friend: 1,
          viewStatus: 1,
        },
      },
    ]);

    if (!getAllContacts || getAllContacts?.length === 0)
      throw new Error("No friends found");

    return res.status(200).json({
      error: null,
      data: getAllContacts,
      message: "All friends list",
    });
  } catch (error) {
    res.status(500).json({
      message: "error",
      data: {},
      error: error,
    });
  }
});

module.exports = router;
