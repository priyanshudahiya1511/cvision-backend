import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const EMBEDDING_MODEL = "gemini-embedding-001";

/**
 * Convert a piece of text into an embedding vector.
 * @param {string} text
 * @returns {Promise<number[]>}
 */
export const embedText = async (text) => {
    if (!text?.trim()) {
        throw new Error("embedText: text must be a non-empty string");
    }

    const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: { outputDimensionality: 768 },
    });

    return response.embeddings[0].values;
};
