import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    cron_schedule: { type: String, default: "0 2 * * *" },
}, { timestamps: true });

export default mongoose.model("Setting", settingSchema);
