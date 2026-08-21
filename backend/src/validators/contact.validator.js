import { body, validationResult } from "express-validator";

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

export const validateCreateContact = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number format (Indian format required)"),

  body("destination")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Destination must be at most 100 characters"),

  body("travelDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid travel date format")
    .custom((value) => {
      if (value && new Date(value) < new Date(new Date().toDateString())) {
        throw new Error("Travel date cannot be in the past");
      }
      return true;
    }),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),

  validateRequest,
];

export const validateUpdateContactStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["new", "read", "replied", "archived"])
    .withMessage("Status must be one of: new, read, replied, archived"),

  validateRequest,
];