import { GoogleGenAI } from "@google/genai";
import { embedText } from "../services/embeddingService.js";
import KnowledgeChunk from "../models/knowledgeChunk.model.js";
import { Double } from "mongodb";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const getSuggestions = async (req, res) => {
    try {
        const { sectionText, category } = req.body;

        if (!sectionText?.trim()) {
            return res.status(400).json({ error: "sectionText is required" });
        }

        const querryEmbedding = await embedText(sectionText);
        const queryVector = querryEmbedding.map((n) => new Double(n));

        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    path: "embedding",
                    queryVector,
                    numCandidates: 50,
                    limit: 5,
                    ...(category ? { filter: { category } } : {}),
                },
            },
            {
                $project: {
                    text: 1,
                    category: 1,
                    score: { $meta: "vectorSearchScore" },
                },
            },
        ];

        const relevantChunks = await KnowledgeChunk.aggregate(pipeline);

        if (relevantChunks.length === 0) {
            return res.status(404).json({
                error: "No relevant tips found. Has the knowledge base been seeded?",
            });
        }

        const contextBlock = relevantChunks
            .map((c, i) => `Tip ${i + 1} (${c.category}): ${c.text}`)
            .join("\n");

        const prompt = `You are a resume coach. A candidate has written the following resume section:

"""
${sectionText}
"""

Here are relevant best-practice tips retrieved from a knowledge base:
${contextBlock}

Using ONLY the tips above as your basis, respond ONLY in this JSON format, no extra text, no markdown backticks:
{
    "suggestions": [<2-4 short strings, specific actionable suggestions based on the tips>]
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
        });

        const cleaned = response.text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        return res.json({
            suggestions: parsed.suggestions || [],
            groundedIn: relevantChunks.map((c) => ({
                text: c.text,
                category: c.category,
                similarityScore: c.score,
            })),
        });
    } catch (error) {
        console.error("Error in getSuggestions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
