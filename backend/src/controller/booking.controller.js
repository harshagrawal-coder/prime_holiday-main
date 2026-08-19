import Booking from "../model.js/bookingSchema.js";
import Tour from "../model.js/tourSchema.js";
import mongoose from "mongoose";

const generateBookingCode = () =>
  `PH-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
const getBasePrice = (tour) => tour.discountPrice || tour.price || 0;

export async function createBooking(req, res) {
  try {
    const {
      tourId,
      primaryContact,
      travelers = [],
      departureDate,
      adults,
      children = 0,
      pickupLocation = "",
      specialRequest = "",
      paymentType = "full",
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Tour ID",
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const basePrice = getBasePrice(tour);
    const adultPrice = Number(adults) * basePrice;
    const childPrice = Number(children) * basePrice * 0.5;
    const subtotal = adultPrice + childPrice;
    const taxes = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + taxes;
    const payNow =
      paymentType === "advance"
        ? Math.round(grandTotal * 0.3)
        : paymentType === "arrival"
          ? 0
          : grandTotal;

    const booking = await Booking.create({
      bookingCode: generateBookingCode(),
      userId: req.user?._id || null,
      tourId: tour._id,
      tourName: tour.name,
      tourCity: tour.cityName,
      tourState: tour.stateName,
      primaryContact,
      travelers,
      departureDate: new Date(departureDate),
      adults: Number(adults),
      children: Number(children),
      pickupLocation,
      specialRequest,
      paymentType,
      pricing: {
        basePrice,
        adultPrice,
        childPrice,
        taxes,
        grandTotal,
        payNow,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getAllBookings(req, res) {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const currentPage = Math.max(Number(page) || 1, 1);
    const pageLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
    const skip = (currentPage - 1) * pageLimit;

    const totalBookings = await Booking.countDocuments(query);
    const totalPages = Math.ceil(totalBookings / pageLimit);

    const bookings = await Booking.find(query)
      .populate("tourId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageLimit)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      count: bookings.length,
      pagination: {
        totalBookings,
        totalPages,
        currentPage,
        limit: pageLimit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
      data: bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getBookingById(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Booking ID",
      });
    }

    const booking = await Booking.findById(id)
      .populate("tourId", "name slug thumbnail price discountPrice")
      .populate("userId", "fullname email")
      .lean();

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      req.user &&
      req.user.role !== "admin" &&
      booking.userId &&
      booking.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking fetched successfully",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Booking ID",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Booking ID",
      });
    }

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
