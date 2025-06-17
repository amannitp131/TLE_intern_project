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

//////////////////////////////////
/// Add student //////////////////
/////////////////////////////////

router.post("/add-student", async (req, res) => {
    try {
        const { name, email, phone, cf_handle } = req.body;
        const newStudent = new Student({
            name,
            email,
            phone,
            cf_handle
        });
        await newStudent.save();
        res.send("✅ Student added");
    } catch (err) {
        res.status(500).send("❌ Error: " + err.message);
    }
});


////////////////////////////////////
// Edit student by Codeforces handle
////////////////////////////////////
router.put("/edit-student-by-handle/:cf_handle", async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const updatedStudent = await Student.findOneAndUpdate(
            { cf_handle: req.params.cf_handle },
            { name, email, phone },
            { new: true }
        );
        if (!updatedStudent) return res.status(404).send("❌ Student not found");
        res.send("✅ Student updated");
    } catch (err) {
        res.status(500).send("❌ Error: " + err.message);
    }
});

//////////////////////////////////////
// Delete student by Codeforces handle
//////////////////////////////////////


router.delete("/delete-student-by-handle/:cf_handle", async (req, res) => {
    try {
        const deletedStudent = await Student.findOneAndDelete({ cf_handle: req.params.cf_handle });
        if (!deletedStudent) return res.status(404).send("❌ Student not found");
        res.send("✅ Student deleted");
    } catch (err) {
        res.status(500).send("❌ Error: " + err.message);
    }
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
