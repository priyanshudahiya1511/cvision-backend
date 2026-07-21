import { GoogleGenAI } from "@google/genai";
import Resume from "../models/resume.model.js";
import MatchResult from "../models/matchResult.model.js";
import { embedText } from "../services/embeddingService.js";
import { cosineSimilarity } from "../services/similarityService.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const getMatchScore = async (req, res) => {
    try {
        const { resumeId, jobDescription } = req.body;

        if (!resumeId || !jobDescription?.trim()) {
            return res.status(400).json({
                error: "Both resumeId and jobDescription are required",
            });
        }

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        if (resume.user.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ error: "Forbidden: not your resume" });
        }

        const resumeText = resume.extractedText;

        const [resumeEmbedding, jdEmbedding] = await Promise.all([
            embedText(resumeText),
            embedText(jobDescription),
        ]);

        const similarity = cosineSimilarity(resumeEmbedding, jdEmbedding);
        const matchPercent = Math.round(similarity * 100);

        const prompt = `You are a resume screening assistant. Compare this resume against this job description.

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION:
"""
${jobDescription}
"""

The calculated semantic match score is ${matchPercent}%.

List:
1. 3-5 specific skills/requirements from the JD that the resume clearly covers
2. 3-5 specific skills/requirements from the JD that are missing or weak in the resume

Be specific — name actual skills/tools/requirements, not generic statements.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
        });

        const analysis = response.text;

        const matchResult = await MatchResult.create({
            user: req.user._id,
            resume: resume._id,
            jobDescription,
            matchPercent,
            analysis,
        });

        return res.json({
            matchId: matchResult._id,
            matchPercent,
            analysis,
        });
    } catch (error) {
        console.error("Error in getMatchScore:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMatchHistory = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        if (resume.user.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ error: "Forbidden: not your resume" });
        }

        const matches = await MatchResult.find({ resume: resumeId })
            .sort({ createdAt: -1 })
            .select("-analysis"); // list view: skip the long text, keep it light

        return res.json({ matches });
    } catch (error) {
        console.error("Error in getMatchHistory:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
