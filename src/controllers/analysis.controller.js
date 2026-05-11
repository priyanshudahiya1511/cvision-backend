import Resume from "../models/resume.model.js";
import Analysis from "../models/analysis.model.js";
import { analyzeResumeWithGemini } from "../utils/gemini.js";

const analyzeResume = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const resume = await Resume.findOne({
            _id: resumeId,
            user: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const existingAnalysis = await Analysis.findOne({ resume: resumeId });
        if (existingAnalysis) {
            return res.status(200).json({
                message: "Analysis already exists",
                analysis: existingAnalysis,
            });
        }

        const analysisResult = await analyzeResumeWithGemini(
            resume.extractedText
        );

        const analysis = await Analysis.create({
            user: req.user._id,
            resume: resumeId,
            score: analysisResult.score,
            strengths: analysisResult.strengths,
            weaknesses: analysisResult.weaknesses,
            suggestions: analysisResult.suggestions,
            summary: analysisResult.summary,
            detailedFeedback: analysisResult.detailedFeedback,
        });

        resume.isAnalysed = true;
        await resume.save();

        return res.status(201).json({
            message: "Resume analyzed successfully",
            analysis,
        });
    } catch (error) {
        console.error("Error analyzing resume:", error);
        return res.status(500).json({ message: "Error analyzing resume" });
    }
};

const getAnalysisByResumeId = async (req, res) => {
    try {
        const { resumeId } = req.params;

        const analysis = await Analysis.findOne({
            resume: resumeId,
            user: req.user._id,
        });

        if (!analysis) {
            return res.status(404).json({ message: "Analysis not found" });
        }

        return res.status(200).json({
            message: "Analysis fetched successfully",
            analysis,
        });
    } catch (error) {
        console.error("Error fetching analysis:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { analyzeResume, getAnalysisByResumeId };
