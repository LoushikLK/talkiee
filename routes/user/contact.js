const router = require("express").Router();

const auth = require("../../middleware/auth");
const userSchema = require("../../models/user");

const contactModel = require("../../models/contacts");
const parsePhoneNumber = require("libphonenumber-js");

router.post("/update", auth, async (req, res) => {
  try {
    const { contacts, muted } = req.body;

    // console.log(contacts);

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

    // console.log(phoneNumberArray[phoneNumberArray?.length - 1]);

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
          profileImage: 1,
          status: 1,
        },
      },
    ]);

    if (allUserContacts?.length) {
      let viewStatusUser = allUserContacts?.map((user) => {
        return {
          _id: user?._id,
          phone: user?.phone,
          viewStatus: !mutedNumberArray?.some((item) => {
            return item === user?.phone;
          }),
        };
      });

      // console.log("view", viewStatusUser);

      const updatedContacts = await contactModel.findOneAndUpdate(
        { user: req.user.id },
        {
          contacts: viewStatusUser,
        },
        {
          new: true,
        }
      );

      // console.log(updatedContacts);
      //update contacts

      if (!updatedContacts) {
        let newContacts = new contactModel({
          user: req.user.id,
          contacts: viewStatusUser,
        });

        const saveNewContacts = await newContacts.save();

        if (!saveNewContacts) {
          return res.status(200).json({
            message: "Contacts updating failed",
            data: {},
            error: "Contacts updating failed",
          });
        }

        return res.status(200).json({
          message: "Contacts updated",
          data: allUserContacts,
          error: null,
        });
      }

      return res.status(200).json({
        message: "Contacts updated",
        data: allUserContacts,
        error: null,
      });
    } else {
      return res.status(200).json({
        message: "Contacts not found",
        data: {},
        error: null,
      });
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      message: "Error updating contacts",
      data: {},
      error: error?.message,
    });
  }
});

module.exports = router;
