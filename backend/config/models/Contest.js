import mongoose from "mongoose";

const contestSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    name: String,
    date: Date,
    rating_change: Number,
    rank: Number,
}, { timestamps: true });

export default mongoose.model("Contest", contestSchema);
