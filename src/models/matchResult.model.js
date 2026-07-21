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
        analysis: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const MatchResult = mongoose.model("MatchResult", matchResultSchema);

export default MatchResult;
