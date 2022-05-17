const { check } = require("express-validator");

const registerValidationSchema = [
  check(
    "email",
    "Email length should be 5 to 30 characters with @ and . in between"
  )
    .isEmail()
    .isLength({ min: 5, max: 30 })
    .isString(),
  check("name", "Name length should be 5 to 20 characters")
    .isLength({
      min: 3,
      max: 20,
    })
    .isString(),
  check(
    "phone",
    "Mobile number should contains 10 digits without spaces and + sign or any other sign."
  ).isString(),
  check("password", "Password length should be 8 to 10 characters")
    .isLength({
      min: 6,
    })
    .isString(),
  check("gender", "Gender is required").isString(),
];

module.exports = registerValidationSchema;
