import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//common middlewares
app.use(
    cors({
        origin: [
            process.env.CORS_ORIGIN || "http://localhost:5173",
            "http://localhost:3000",
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("public"));
app.use(cookieParser());

//import routes
import authRouter from "./routes/auth.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import analysisRouter from "./routes/analysis.routes.js";

app.use("/api/V1/auth", authRouter);
app.use("/api/V1/resume", resumeRouter);
app.use("/api/V1/analysis", analysisRouter);

export { app };
