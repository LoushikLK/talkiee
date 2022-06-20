const auth = require("../../middleware/auth");

const router = require("express").Router();

const groupConversation = require("../../models/groupConversation");

const userModel = require("../../models/user");

//add user to group conversation

//create a group conversation

router.post("/create", auth, async (req, res) => {
  try {
    const { members, title, groupImage, description } = req.body;

    if (!members) {
      return res.status(400).json({
        error: "At least one member is required",
        data: {},
        message: "At least one member is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        error: "Title is required",
        data: {},
        message: "Title is required",
      });
    }

    const user = req.user.id;

    const memberList = [...members, user];

    const newConversation = new groupConversation({
      title: title,
      members: memberList,
      createdBy: user,
      groupImage: groupImage,
      description: description,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      groupAdmin: [user],
    });

    // console.log("new conversation", newConversation);

    const saveConversation = await newConversation.save();

    if (!saveConversation) {
      return res.status(400).json({
        error: "Conversation not created",
        data: {},
        message: "Conversation not created",
      });
    }

    //after group-created add group id to all members group list

    // console.log("memberList", memberList);

    memberList.forEach(async (member) => {
      await userModel.findByIdAndUpdate(
        member,
        {
          $push: {
            groups: saveConversation._id,
          },
        },
        { new: true }
      );
    });

    return res.status(200).json({
      error: null,
      data: saveConversation,
      message: "Group created",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      data: {},
      message: "Error in creating group",
    });
  }
});

router.post("/adduser", auth, async (req, res) => {
  try {
    const { conversationId, userId } = req.body;
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

    //check user exist or not

    const userExist = await userModel.findById(userId);

    if (!userExist) {
      return res.status(400).json({
        error: "User not found",
        data: {},
        message: "User not found",
      });
    }

    //check if user already in conversation or not

    const userInConversation = await groupConversation
      .findById(conversationId)
      .populate("members");

    if (
      userInConversation.members.some((member) => member.toString() === userId)
    ) {
      return res.status(400).json({
        error: "User already in conversation",
        data: {},
        message: "User already in conversation",
      });
    }

    //then add user to group conversation

    const addUser = await groupConversation.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          members: userId,
        },
      },
      {
        new: true,
      }
    );

    if (!addUser) {
      return res.status(400).json({
        error: "User not added",
        data: {},
        message: "User not added",
      });
    }

    return res.status(200).json({
      error: null,
      data: addUser,
      message: "User added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      data: {},
      message: "Error in adding user",
    });
  }
});

//remove user from group conversation

router.post("/removeuser", auth, async (req, res) => {
  try {
    const { conversationId, userId } = req.body;
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

    //check user exist or not

    const userExist = await userModel.findById(userId);

    if (!userExist) {
      return res.status(400).json({
        error: "User not found",
        data: {},
        message: "User not found",
      });
    }

    //check if user already in conversation or not

    const userInConversation = await groupConversation
      .findById(conversationId)
      .populate("members");

    if (
      !userInConversation.members.some((member) => member.toString() === userId)
    ) {
      return res.status(400).json({
        error: "User not in conversation",
        data: {},
        message: "User not in conversation",
      });
    }

    //check if user is group admin or not

    const userIsAdmin = await groupConversation.findById(conversationId);

    console.log("userIsAdmin", userIsAdmin);

    if (userIsAdmin.groupAdmin.some((admin) => admin.toString() === userId)) {
      //   console.log("user is admin");

      return res.status(400).json({
        error: "Can not remove admin",
        data: {},
        message: "Admin can not be removed",
      });
    }

    //then remove user from group conversation

    const removeUser = await groupConversation.findByIdAndUpdate(
      conversationId,
      {
        $pull: {
          members: userId,
        },
      },
      {
        new: true,
      }
    );

    if (!removeUser) {
      return res.status(400).json({
        error: "User not removed",
        data: {},
        message: "User not removed",
      });
    }

    return res.status(200).json({
      error: null,
      data: removeUser,
      message: "User removed",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      data: {},
      message: "Error in removing user",
    });
  }
});

router.post("/update", auth, async (req, res) => {
  try {
    const { conversationId, title, description, groupImage } = req.body;

    const user = req.user.id;

    //check message conversation exist or not

    if (!conversationId) {
      return res.status(400).json({
        error: "Conversation Id not found",
        data: {},
        message: "Conversation id not found",
      });
    }

    const conversation = await groupConversation.findById(conversationId);

    if (!conversation) {
      return res.status(400).json({
        error: "Conversation not found",
        data: {},
        message: "Conversation not found",
      });
    }

    //update conversation

    const updateConversation = await groupConversation.findByIdAndUpdate(
      conversationId,
      {
        title: title || conversation.title,
        description: description || conversation.description,
        groupImage: groupImage || conversation.groupImage,
      },
      { new: true }
    );

    if (!updateConversation) {
      return res.status(400).json({
        error: "Conversation not updated",
        data: {},
        message: "Conversation not updated",
      });
    }

    return res.status(200).json({
      error: null,
      data: updateConversation,
      message: "Group  updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
      data: {},
      message: "Error in updating conversation",
    });
  }
});

module.exports = router;
