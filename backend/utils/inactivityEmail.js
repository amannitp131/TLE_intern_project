import Student from "../config/models/Student.js";
import Submission from "../config/models/Submission.js";
import nodemailer from "nodemailer";

export async function sendInactivityEmails() {
    const students = await Student.find({ auto_email_disabled: false });
    const now = new Date();
    for (const student of students) {
        const lastSubmission = await Submission.findOne({ student_id: student._id }).sort({ timestamp: -1 });
        if (!lastSubmission || (now - lastSubmission.timestamp) > 7 * 24 * 60 * 60 * 1000) {
            // Send email
            // setup nodemailer
            student.reminder_count += 1;
            await student.save();
        }
    }
}
