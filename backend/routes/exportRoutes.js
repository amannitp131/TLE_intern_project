import express from "express";
import Student from "../config/models/Student.js";
import { Parser } from "json2csv";

const router = express.Router();

router.get("/students/export", async (req, res) => {
    const students = await Student.find().lean();
    const fields = ["name", "email", "phone", "handle", "current_rating", "max_rating", "last_synced", "auto_email_disabled", "reminder_count"];
    const parser = new Parser({ fields });
    const csv = parser.parse(students);
    res.header("Content-Type", "text/csv");
    res.attachment("students.csv");
    res.send(csv);
});

export default router;
