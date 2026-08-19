import { Router } from "express";

import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../controller/booking.controller.js";

import { authenticate, isAdmin } from "../middleware/auth.middleware.js";

import {
  validateCreateBooking,
  validateUpdateBookingStatus,
} from "../validators/booking.validator.js";

const bookingRouter = Router();

bookingRouter.post("/", validateCreateBooking, createBooking);
bookingRouter.get("/", authenticate, isAdmin, getAllBookings);
bookingRouter.get("/:id", authenticate, getBookingById);
bookingRouter.patch(
  "/:id/status",
  authenticate,
  isAdmin,
  validateUpdateBookingStatus,
  updateBookingStatus,
);
bookingRouter.delete("/:id", authenticate, isAdmin, deleteBooking);

export default bookingRouter;
