import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    moodImage: {
      url: {
        type: String,
        required: [true, "moodImage is required"],
        
      },
      fileId: {
        type: String,
        required: [true, "Cover image file ID is required"],
        trim: true,
      },
      alt: {
        type: String,
        required: [true, "Cover image alt text is required"],
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Mood = mongoose.model("Mood", moodSchema);

export default Mood;


