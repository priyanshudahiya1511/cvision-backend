import { GoogleGenAI } from "@google/genai";

export const analyzeResumeWithGemini = async (resumeText) => {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        const prompt = `
        You are a professional career coach and resume reviewer.
        Review the following resume and provide structured feedback.
        Be constructive, encouraging and professional.
        Respond ONLY in this JSON format, no extra text, no markdown backticks:
        {
            "score": <number 0-100>,
            "strengths": [<list of short strings>],
            "weaknesses": [<list of short strings>],
            "suggestions": [<list of short strings>],
            "summary": "<2-3 sentences overall feedback>",
            "detailedFeedback": "<full detailed feedback in markdown format covering: Overview, Content, Formatting, Impact, Language and Actionable Recommendations>"
        }
        
        Here is the resume: ${resumeText}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
        });

        const cleaned = response.text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        return {
            score: parsed.score || 0,
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            suggestions: parsed.suggestions || [],
            summary: parsed.summary || "",
            detailedFeedback: parsed.detailedFeedback || "",
        };
    } catch (error) {
        console.error("Error analyzing resume with Gemini:", error);
        throw error;
    }
};
