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

export const validateCreateBooking = [
  // Tour
  body("tourId")
    .notEmpty()
    .withMessage("Tour is required")
    .isMongoId()
    .withMessage("Invalid tour id"),

  // Step 1 - Primary Contact
  body("primaryContact.fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),

  body("primaryContact.email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("primaryContact.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid phone number"),

  body("primaryContact.country")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Country must be at most 100 characters"),

  body("primaryContact.emergencyName")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Emergency contact name must be at most 100 characters"),

  body("primaryContact.emergencyPhone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Emergency contact phone must be at most 20 characters"),

  // Step 1 - All Travelers
  body("travelers")
    .optional()
    .isArray({ max: 8 })
    .withMessage("Travelers must be an array of at most 8 people"),

  body("travelers.*.fullName")
    .trim()
    .notEmpty()
    .withMessage("Traveler full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Traveler name must be between 2 and 100 characters"),

  // Step 2 - Travel Details
  body("departureDate")
    .notEmpty()
    .withMessage("Departure date is required")
    .isISO8601()
    .withMessage("Invalid departure date")
    .custom((value) => new Date(value) >= new Date(new Date().toDateString()))
    .withMessage("Departure date cannot be in the past"),

  body("adults")
    .notEmpty()
    .withMessage("Adults is required")
    .isInt({ min: 1, max: 50 })
    .withMessage("Adults must be between 1 and 50"),

  body("children")
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage("Children must be between 0 and 50"),

  body("pickupLocation")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Pickup location must be at most 200 characters"),

  body("specialRequest")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Special request must be at most 1000 characters"),

  // Step 3 - Payment Preference
  body("paymentType")
    .optional()
    .isIn(["full", "advance", "arrival"])
    .withMessage("Payment type must be full, advance, or arrival"),

  validateRequest,
];

export const validateUpdateBookingStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "confirmed", "cancelled"])
    .withMessage("Status must be pending, confirmed, or cancelled"),

  validateRequest,
];
