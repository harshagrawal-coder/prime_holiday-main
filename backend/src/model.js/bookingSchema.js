import mongoose from "mongoose";

const travelerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);
const bookingSchema = new mongoose.Schema(
  {
    bookingCode: {
      type: String,
      unique: true,
      trim: true,
      index: true,
    },
    // User (optional for guests)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // Tour
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    tourName: {
      type: String,
      required: true,
      trim: true,
    },
    tourCity: {
      type: String,
      trim: true,
      default: "",
    },
    tourState: {
      type: String,
      trim: true,
      default: "",
    },

    // Step 1 - Travelers Details
    primaryContact: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        trim: true,
        default: "",
      },

      emergencyName: {
        type: String,
        trim: true,
        default: "",
      },

      emergencyPhone: {
        type: String,
        trim: true,
        default: "",
      },
    },

    travelers: {
      type: [travelerSchema],
      default: [],
    },

    // Step 2 - Travel Details
    departureDate: {
      type: Date,
      required: true,
    },

    adults: {
      type: Number,
      required: true,
      min: 1,
    },

    children: {
      type: Number,
      default: 0,
      min: 0,
    },

    pickupLocation: {
      type: String,
      trim: true,
      default: "",
    },

    specialRequest: {
      type: String,
      trim: true,
      default: "",
    },

    // Step 3 - Payment Preference
    paymentType: {
      type: String,
      enum: ["full", "advance", "arrival"],
      default: "full",
    },

    // Pricing snapshot at the time of booking
    pricing: {
      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },

      adultPrice: {
        type: Number,
        min: 0,
      },

      childPrice: {
        type: Number,
        min: 0,
      },

      taxes: {
        type: Number,
        min: 0,
      },

      grandTotal: {
        type: Number,
        required: true,
        min: 0,
      },

      payNow: {
        type: Number,
        min: 0,
      },
    },

    // Booking lifecycle
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
