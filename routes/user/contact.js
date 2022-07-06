const router = require("express").Router();

const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");

const contactModel = require("../../models/contacts");

router.post("/update", auth, async (req, res) => {
  try {
    const { contacts } = req.body;

    //get user contacts from db

    const prevContacts = await contactModel
      .findOne({ user: req.user.id })
      .lean();

    //update contacts

    if (!prevContacts) {
      const newContact = new contactModel({
        user: req.user.id,
        contacts,
      });

      await newContact.save();

      return res.status(200).json({
        message: "Contacts updated",
        data: {},
        error: null,
      });
    }

    const updatedContacts = [];

    prevContacts?.contacts.forEach((contact) => {
      const newContact = contacts.find((c) => c.phone !== contact.phone);

      if (newContact) {
        updatedContacts.push({
          _id: newContact._id,
          name: newContact.name,
          phone: newContact.phone,
          viewStatus: true,
        });
      }
    });

    const savedContacts = await contactModel
      .findOneAndUpdate(
        prevContacts._id,
        {
          $push: {
            contacts: updatedContacts,
          },
        },
        {
          new: true,
        }
      )
      .lean();

    if (!savedContacts) {
      return res.status(400).json({
        message: "Contacts not updated",
        data: {},
        error: "Contacts not updated",
      });
    }

    return res.status(200).json({
      message: "Contacts updated",
      data: {},
      error: null,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
