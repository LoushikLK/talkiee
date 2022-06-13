const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");
const router = require("express").Router();
const conversationSchema = require("../../models/conversation");
const messageSchema = require("../../models/messages");
const { default: mongoose } = require("mongoose");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user.id;

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
      allConversations.conversations.map(async (conversation) => {
        const messages = await messageSchema
          .find({ conversationId: conversation._id })
          .populate("sender")
          .limit(1);

        const userData = await userSchema.find({
          conversations: [conversation._id],
        });

        console.log(`user`, userData);

        let name = userData?.find((user) => user._id !== user)?.name;
        let _id = userData?.find((user) => user._id !== user)?._id;
        let profileImage = userData?.find(
          (user) => user._id !== user
        )?.profileImage;
        let phone = userData?.find((user) => user._id !== user)?.phone;
        let gender = userData?.find((user) => user._id !== user)?.gender;

        return {
          _id: conversation._id,
          message: messages[0],
          userData: {
            name,
            _id,
            profileImage,
            phone,
            gender,
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

    console.log(allConversations);
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
