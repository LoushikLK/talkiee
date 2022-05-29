const conversationSchema = require("../models/messages");
const userSchema = require("../models/register");
const checkMessageId = async (req, res, next) => {
  try {
    const { messageId } = req.query;
    const { to } = req.body;
    const user = req.user.id;
    const { message } = req.body;

    const toUser = await userSchema.findById(to);
    console.log(messageId);

    if (!toUser) {
      return res.status(400).json({
        message: "User not found",
        data: {},
        error: "Bad Request",
      });
    }

    const messageExist = await conversationSchema.findOneById(messageId);

    if (!messageExist) {
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
    }

    req.messageId = messageExist._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "error",
      data: {},
      error: "server error",
    });
  }
};

module.exports = checkMessageId;
