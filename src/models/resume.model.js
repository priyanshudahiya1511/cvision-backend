import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        originalFileName: {
            type: String,
            required: true,
        },
        extractedText: {
            type: String,
            required: true,
        },
        isAnalysed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
