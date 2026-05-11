import express from "express";
import {
    uploadResume,
    getResumeHistory,
    getResumeById,
} from "../controllers/resume.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/upload", protectRoute, upload.single("resume"), uploadResume);
router.get("/history", protectRoute, getResumeHistory);
router.get("/:id", protectRoute, getResumeById);

export default router;
