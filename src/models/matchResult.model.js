import mongoose from "mongoose";

const matchResultSchema = new mongoose.Schema(
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
        jobDescription: {
            type: String,
            required: true,
        },
        matchPercent: {
            type: Number,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        coveredSkills: {
            type: [String],
            default: [],
        },
        missingSkills: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

const MatchResult = mongoose.model("MatchResult", matchResultSchema);

export default MatchResult;
