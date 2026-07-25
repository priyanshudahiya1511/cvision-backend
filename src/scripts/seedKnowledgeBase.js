import "dotenv/config";
import mongoose from "mongoose";
import KnowledgeChunk from "../models/knowledgeChunk.model.js";
import { embedText } from "../services/embeddingService.js";
import { DB_NAME } from "../constant.js";

const RAW_TIPS = [
    {
        category: "experience",
        text: "Quantify your impact wherever possible. Instead of 'responsible for improving website performance', write 'reduced page load time by 40 percent, cutting bounce rate by 15 percent'.",
    },
    {
        category: "experience",
        text: "Start each bullet point with a strong action verb like led, built, designed, or shipped rather than passive phrases like 'was involved in' or 'helped with'.",
    },
    {
        category: "summary",
        text: "Keep your professional summary to 2-3 sentences focused on your specific role and biggest strength, not a generic statement like 'hardworking team player seeking opportunities'.",
    },
    {
        category: "skills",
        text: "List skills that are actually mentioned in the job description you're targeting. Generic skill dumps add little value compared to specific tools and technologies relevant to the role.",
    },
    {
        category: "general",
        text: "Keep resume length to one page for under 10 years of experience, two pages maximum otherwise. Recruiters spend an average of 6-7 seconds on a first pass.",
    },
    {
        category: "experience",
        text: "Avoid listing job duties as a task list. Instead frame each bullet as an outcome: what changed because you did the work.",
    },
    {
        category: "education",
        text: "Once you have 2+ years of professional experience, move education below your experience section and trim it to degree, institution, and graduation year.",
    },
    {
        category: "general",
        text: "Use consistent formatting for dates, headers, and bullet styles throughout the document. Inconsistent formatting is one of the most common reasons resumes get flagged as low effort.",
    },
];

async function seed() {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("connected to mongo");

    await KnowledgeChunk.deleteMany({ source: "manual-seed" });

    for (const tip of RAW_TIPS) {
        const embedding = await embedText(tip.text);
        await KnowledgeChunk.create({
            text: tip.text,
            category: tip.category,
            embedding,
            source: "manual-seed",
        });
        console.log(`Seeded [${tip.category}]: ${tip.text.slice(0, 50)}...`);
    }

    console.log(`Done. Seeded ${RAW_TIPS.length} tips.`);

    await mongoose.disconnect();

    process.exit(0);
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
