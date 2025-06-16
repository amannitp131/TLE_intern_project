import express from "express";
import Student from "../config/models/Student.js";
import ProblemSolved from "../config/models/ProblemSolved.js";

const router = express.Router();

// Top students by rating gain in last 30 days
router.get("/rating-gain", async (req, res) => {
    // aggregate rating gain logic
    res.json([]);
});

// Top students by problems solved per day
router.get("/problems-per-day", async (req, res) => {
    // aggregate problems solved per day logic
    res.json([]);
});

export default router;
