import express from "express";
import { getSuggestions } from "../controllers/suggestions.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, getSuggestions);

export default router;
