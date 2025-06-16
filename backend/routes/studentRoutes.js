import express from "express";
import Student from "../config/models/Student.js";
import Contest from "../config/models/Contest.js";
import ProblemSolved from "../config/models/ProblemSolved.js";
import Submission from "../config/models/Submission.js";

const router = express.Router();

// List students
router.get("/", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// Add student
router.post("/", async (req, res) => {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
});

// Edit student
router.put("/:id", async (req, res) => {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
});

// Delete student
router.delete("/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Student profile view
router.get("/:id", async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.json(student);
});

// Contest history
router.get("/:id/contests", async (req, res) => {
    const contests = await Contest.find({ student_id: req.params.id });
    res.json(contests);
});

// Problems solved
router.get("/:id/problems", async (req, res) => {
    const problems = await ProblemSolved.find({ student_id: req.params.id });
    res.json(problems);
});

// Submissions
router.get("/:id/submissions", async (req, res) => {
    const submissions = await Submission.find({ student_id: req.params.id });
    res.json(submissions);
});

export default router;
