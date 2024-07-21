import { body, param } from "express-validator";

const allowedTypes = [
  "book",
  "ebook",
  "journal",
  "magazine",
  "newspaper",
  "dvd",
  "cd",
  "audiobook",
  "map",
  "atlas",
  "microform",
  "manuscript",
  "archive",
  "database",
  "computer",
  "tablet",
  "study_room",
  "conference_room",
  "multimedia_kit",
  "artwork",
  "exhibit",
  "game",
  "puzzle",
];

export const validateResourceId = [
  param("id").isMongoId().withMessage("Invalid resource ID"),
];

// Validation for creating a resource
export const validateResourceCreation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(allowedTypes)
    .withMessage(
      `Type must be one of the following: ${allowedTypes.join(", ")}`
    ),
  // body("description").notEmpty().withMessage("Description is required"),
  body("availability")
    .isBoolean()
    .withMessage("Availability is required and must be a boolean"),
  body("location").notEmpty().withMessage("Location is required"),
];

// Validation for updating a resource
export const validateResourceUpdate = [
  param("id").isMongoId().withMessage("Invalid resource ID format"),
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name must be a non-empty string"),
  body("type")
    .optional()
    .notEmpty()
    .withMessage("Type must be a non-empty string")
    .isIn(allowedTypes)
    .withMessage(
      `Type must be one of the following: ${allowedTypes.join(", ")}`
    ),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description must be a non-empty string"),
  body("availability")
    .optional()
    .isBoolean()
    .withMessage("Availability must be a boolean"),
  body("location")
    .optional()
    .notEmpty()
    .withMessage("Location must be a non-empty string"),
];

// Validation for borrowing or returning a resource
export const validateResourceBorrowReturn = [
  param("resourceId").isMongoId().withMessage("Invalid resource ID format"),
];
