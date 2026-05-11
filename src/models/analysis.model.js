import mongoose from "mongoose";

const analysisSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        resume: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Resume",
            required: true,
        },
        score: {
            type: Number,
            default: 0,
        },
        strengths: {
            type: [String],
            default: [],
        },
        weaknesses: {
            type: [String],
            default: [],
        },
        suggestions: {
            type: [String],
            default: [],
        },

        summary: {
            type: String,
            default: "",
        },
        detailedFeedback: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Analysis = mongoose.model("Analysis", analysisSchema);

export default Analysis;
