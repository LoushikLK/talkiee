const router = require("express").Router();

const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");

const contactModel = require("../../models/contacts");
const parsePhoneNumber = require("libphonenumber-js");

router.post("/update", auth, async (req, res) => {
  try {
    const { contacts, muted } = req.body;

    //get user contacts from db

    let phoneNumberArray = [];

    let mutedNumberArray = [];

    if (contacts?.length > 0) {
      contacts?.forEach((contact) => {
        let phoneNumber = parsePhoneNumber(contact.phoneNumber, "IN");
        phoneNumberArray?.push(phoneNumber.number);
      });
    }

    if (muted.length > 0) {
      muted?.forEach((contact) => {
        let phoneNumber = parsePhoneNumber(contact, "IN");
        mutedNumberArray(phoneNumber?.number);
      });
    }

    //check all contacts and retrieve contact that are users

    const allUserContacts = await userSchema?.aggregate([
      {
        $match: { phone: { $in: phoneNumberArray } },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          phone: 1,
        },
      },
    ]);

    let viewStatusUser = allUserContacts?.map((user) => {
      return {
        ...user,
        viewStatus: !mutedNumberArray?.some((item) => {
          return item === user?.phone;
        }),
      };
    });

    const updatedContacts = await contactModel.findOneAndUpdate(
      { user: req.user.id },
      {
        contacts: viewStatusUser,
      }
    );

    //update contacts

    if (!updatedContacts) {
      return res.status(400).json({
        message: "Contacts not updated",
        data: viewStatusUser,
        error: "Contacts not updated",
      });
    }

    return res.status(200).json({
      message: "Contacts updated",
      data: {},
      error: null,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Error updating contacts",
      data: {},
      error: error,
    });
  }
});

module.exports = router;
