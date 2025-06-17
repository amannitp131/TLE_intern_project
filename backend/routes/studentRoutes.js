import express from "express";
import Student from "../config/models/Student.js";
import Contest from "../config/models/Contest.js";
import ProblemSolved from "../config/models/ProblemSolved.js";
import Submission from "../config/models/Submission.js";
import axios from "axios";

const router = express.Router();


//////////////////////
// List of students 
////////////////////

router.get("/get-students", async (req, res) => {
    try {
        const students = await Student.find({}, 'name cf_handle current_rating');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
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

///////////////////////
// Student profile view
///////////////////////

router.get("/:cf_handle", async (req, res) => {
    try {
        const student = await Student.findOne(
            { cf_handle: req.params.cf_handle },
            'name cf_handle current_rating'
        );
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: "Error fetching student" });
    }
});

///////////////////////
//// Contest history
//////////////////////
router.get("/contests/:cf_handle", async (req, res) => {
    const { cf_handle } = req.params;

    try {
        const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${cf_handle}`);

        const contests = response.data.result.map(c => ({
            contestId: c.contestId,
            contestName: c.contestName,
            rank: c.rank,
            oldRating: c.oldRating,
            newRating: c.newRating,
            ratingChange: c.newRating - c.oldRating,
            time: new Date(c.ratingUpdateTimeSeconds * 1000)
        }));

        res.json({ handle: cf_handle, contests });
    } catch (error) {
        console.error("Failed to fetch contest history:", error?.response?.data || error.message);
        res.status(500).json({ error: "Unable to fetch contest data" });
    }
});




////////////////////////
/// Problem analytics
///////////////////////

router.get("/problems/:cf_handle", async (req, res) => {
    const { cf_handle } = req.params;
    const { days = 30 } = req.query; // default: 30 days

    const validDays = [7, 30, 90];
    const numDays = validDays.includes(Number(days)) ? Number(days) : 30;

    try {
        const response = await axios.get(`https://codeforces.com/api/user.status?handle=${cf_handle}`);
        const submissions = response.data.result;

        const cutoff = Date.now() - numDays * 24 * 60 * 60 * 1000;

        const problemMap = new Map(); // unique accepted problems
        const ratingCount = {};
        const dailyCount = {};

        let totalRating = 0;
        let mostDifficult = null;

        for (const sub of submissions) {
            if (sub.verdict !== "OK" || !sub.problem || !sub.creationTimeSeconds) continue;

            const timestamp = sub.creationTimeSeconds * 1000;
            if (timestamp < cutoff) continue;

            const key = `${sub.problem.contestId}-${sub.problem.index}`;
            if (problemMap.has(key)) continue;

            problemMap.set(key, true);

            const rating = sub.problem.rating || 0;
            totalRating += rating;

            // Most difficult problem
            if (!mostDifficult || rating > mostDifficult.rating) {
                mostDifficult = {
                    name: sub.problem.name,
                    contestId: sub.problem.contestId,
                    index: sub.problem.index,
                    rating
                };
            }

            // Ratings bucket
            const bucket = Math.floor(rating / 100) * 100;
            ratingCount[bucket] = (ratingCount[bucket] || 0) + 1;

            // Heatmap per day
            const date = new Date(timestamp).toISOString().split("T")[0];
            dailyCount[date] = (dailyCount[date] || 0) + 1;
        }

        const totalProblems = problemMap.size;
        const avgRating = totalProblems > 0 ? totalRating / totalProblems : 0;
        const avgPerDay = totalProblems / numDays;

        res.json({
            handle: cf_handle,
            range: numDays,
            totalSolved: totalProblems,
            averageRating: avgRating.toFixed(2),
            averagePerDay: avgPerDay.toFixed(2),
            mostDifficult: mostDifficult || null,
            ratingBuckets: ratingCount,
            submissionHeatmap: dailyCount
        });

    } catch (error) {
        console.error("Error fetching submission data:", error.message);
        res.status(500).json({ error: "Unable to fetch problem data" });
    }
});

export default router;
