import { body } from "express-validator";

export const validateLogin = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 character long"),
];

export const validateRegister = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be atleast 6 character long"),
  body("username").notEmpty().withMessage("Username is Required"),
];
