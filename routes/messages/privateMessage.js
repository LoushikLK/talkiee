const auth = require("../../middleware/auth");
const router = require("express").Router();
const conversationSchema = require("../../models/messages");
const checkMessageId = require("../../middleware/messageIdChecker");

router.post("/", auth, checkMessageId, async (req, res) => {
  try {
    const { to } = req.body;
    const { message } = req.body;
    const user = req.user.id;

    res.status(200).json({
      message: "message sent",
      data: {},
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

router.get("/:messageId", auth, async (req, res) => {
  try {
    // const user = req.user.id;
    const { messageId } = req.params;

    if (!messageId) {
      return res.status(400).json({
        message: "message id is required",
        data: {},
        error: "Bad Request",
      });
    }

    const message = await conversationSchema.find(
      { _id: messageId },
      {
        messages: {
          $slice: 1,
        },
      }
    );

    if (!message) {
      return res.status(404).json({
        message: "message not found",
        data: {},
        error: "Not Found",
      });
    }
    // console.log(message);
    res.status(200).json({
      message: "message found",
      data: {
        message,
      },
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
