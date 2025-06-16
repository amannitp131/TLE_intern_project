import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    handle: { type: String, required: true, unique: true },
    current_rating: Number,
    max_rating: Number,
    last_synced: Date,
    auto_email_disabled: { type: Boolean, default: false },
    reminder_count: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Student", studentSchema);
