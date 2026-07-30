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

export const testimonialValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("text")
    .trim()
    .notEmpty()
    .withMessage("Testimonial text is required")
    .isLength({ min: 10 })
    .withMessage("Text must be at least 10 characters"),

  body("rating")
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  validateRequest,
];
