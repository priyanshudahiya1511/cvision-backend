import express from "express";
import {
    getMatchScore,
    getMatchHistory,
} from "../controllers/match.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, getMatchScore);
router.get("/:resumeId", protectRoute, getMatchHistory);

export default router;
