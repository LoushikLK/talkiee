const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");
const router = require("express").Router();
const groupMessage = require("../../models/groupMessage");

const { default: mongoose } = require("mongoose");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user.id;

    const allConversations = await userSchema
      .findById(mongoose.Types.ObjectId(user))
      .populate("groups");

    if (!allConversations) {
      return res.status(404).json({
        error: "Conversations not found",
        data: {},
        message: "Conversations not found",
      });
    }

    // console.log(allConversations);

    //after find conversations, find all messages of each conversation

    // console.log();

    const allData = await Promise.all(
      allConversations.groups.map(async (conversation) => {
        console.log({ conversation });
        const messages = await groupMessage
          .aggregate([
            {
              $match: {
                conversationId: mongoose.Types.ObjectId(conversation),
              },
            },
          ])
          .sort({ createdAt: -1 })
          .limit(1);

        const totalUnseenMessages = await groupMessage
          .aggregate([
            {
              $match: {
                conversationId: mongoose.Types.ObjectId(conversation),
                sender: { $ne: mongoose.Types.ObjectId(user) },
                seen: [
                  {
                    $ne: mongoose.Types.ObjectId(user),
                  },
                ],
              },
            },
          ])
          .count("unseenMessages");

        const userData = await userSchema.aggregate([
          {
            $match: {
              groups: { $in: [messages[0]?.conversationId] },
              _id: { $ne: mongoose.Types.ObjectId(user) },
            },
          },
        ]);

        return {
          _id: conversation._id,
          title: conversation.title,
          totalUnseenMessages: totalUnseenMessages,
          groupImage: conversation.groupImage,
          message: messages[0],
          users: userData?.map((user) => {
            return {
              _id: user._id,
              name: user.name,
              profileImage: user.profileImage,
              gender: user?.gender,
              phone: user?.phone,
            };
          }),
        };
      })
    );

    // console.log(`allData`, allData);

    return res.status(200).json({
      error: null,
      data: allData,
      message: "Friends list",
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
