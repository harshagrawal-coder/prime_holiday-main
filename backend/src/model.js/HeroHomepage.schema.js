import mongoose from "mongoose";

const HeroHomePageSchema = new mongoose.Schema({
    image: {
        url: {
            type: String,
            required: true,
        },
        fileId: {
            type: String,
            required: true,
        },
        alt: {
            type: String,
            required: true,
        },
    },
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

const HeroHomePage = mongoose.model("HeroHomePage", HeroHomePageSchema);

export default HeroHomePage;