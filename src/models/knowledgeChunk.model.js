import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: ["summary", "experience", "skills", "education", "general"],
            default: "general",
        },
        embedding: {
            type: [Number],
            required: true,
        },
        source: {
            type: String,
            default: "manual-seed",
        },
    },
    { timestamps: true }
);

const KnowledgeChunk = mongoose.model("KnowledgeChunk", knowledgeChunkSchema);

export default KnowledgeChunk;
