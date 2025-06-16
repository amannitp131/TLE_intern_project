import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    problem_id: String,
    verdict: String,
    language: String,
    timestamp: Date,
}, { timestamps: true });

export default mongoose.model("Submission", submissionSchema);
