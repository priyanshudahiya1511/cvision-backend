import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    analyzeResume,
    getAnalysisByResumeId,
} from "../controllers/analysis.controller.js";

const router = express.Router();

router.post("/analyze/:resumeId", protectRoute, analyzeResume);
router.get("/:resumeId", protectRoute, getAnalysisByResumeId);

export default router;
