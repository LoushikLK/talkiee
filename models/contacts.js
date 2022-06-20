const mongoose = require("mongoose");

const contactsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  contacts: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
      },
      phone: {
        type: String,
      },
      name: {
        type: String,
      },
      viewStatus: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

module.exports = mongoose.model("contacts", contactsSchema);
