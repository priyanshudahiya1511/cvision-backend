import fs from "fs";
import Resume from "../models/resume.model.js";
import Analysis from "../models/analysis.model.js";
import { PDFParse } from "pdf-parse";

const extractTextFromPDF = async (filepath) => {
    try {
        const dataBuffer = fs.readFileSync(filepath);
        const parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        await parser.destroy();
        return result.text;
    } catch (error) {
        console.error("Error extracting text from PDF:", error);
        throw error;
    }
};

const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res
                .status(400)
                .json({ message: "Please upload a PDF file" });
        }

        const filepath = req.file.path;
        const originalFileName = req.file.originalname;

        const extractedText = await extractTextFromPDF(filepath);

        if (!extractedText || extractedText.trim() === "") {
            return res
                .status(400)
                .json({ message: "Could not extract text from PDF" });
        }

        const resume = await Resume.create({
            user: req.user._id,
            originalFileName,
            extractedText,
            isAnalyzed: false,
        });

        fs.unlinkSync(filepath);

        return res.status(201).json({
            message: "Resume uploaded successfully",
            resumeId: resume._id,
            originalFileName: resume.originalFileName,
        });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Error uploading resume:", error);
        return res.status(500).json({ message: "Error uploading resume" });
    }
};

const getResumeHistory = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user._id })
            .select("-extractedText")
            .sort({ createdAt: -1 });

        if (resumes.length === 0) {
            return res.status(404).json({ message: "No resumes found" });
        }

        return res.status(200).json({
            message: "Resume history fetched successfully",
            resumes,
        });
    } catch (error) {
        console.error("Error fetching resume history:", error);
        return res
            .status(500)
            .json({ message: "Error fetching resume history" });
    }
};

const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const analysis = await Analysis.findOne({ resume: resume._id });

        return res.status(200).json({
            message: "Resume fetched successfully",
            resume,
            analysis: analysis || null,
        });
    } catch (error) {
        console.error("Error fetching resume:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export { uploadResume, getResumeHistory, getResumeById };
