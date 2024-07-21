import { body, param } from "express-validator";

export const validateBookId = [
  param("id").isMongoId().withMessage("Invalid book ID"),
];

export const validateBookCreation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("author").notEmpty().withMessage("Author is required"),
  body("publishedDate")
    .isDate()
    .withMessage("Published Date must be a valid date"),
  body("copiesAvailable")
    .isInt({ min: 1 })
    .withMessage("Copies Available must be a positive integer"),
//   body("genre").notEmpty().withMessage("Genre is required"),
//   body("summary").notEmpty().withMessage("Summary is required"),
];

export const validateBookUpdate = [
  param("id").isMongoId().withMessage("Invalid book ID"),
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("author").optional().notEmpty().withMessage("Author cannot be empty"),
  body("publishedDate")
    .optional()
    .isDate()
    .withMessage("Published Date must be a valid date"),
  body("copiesAvailable")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Copies Available must be a non-negative integer"),
  body("genre").optional().notEmpty().withMessage("Genre cannot be empty"),
  body("summary").optional().notEmpty().withMessage("Summary cannot be empty"),
];

export const validateBookBorrowReturn = [
  param("bookId").isMongoId().withMessage("Invalid book ID"),
];
