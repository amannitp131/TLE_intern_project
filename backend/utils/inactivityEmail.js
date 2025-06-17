import Student from "../config/models/Student.js";
import nodemailer from "nodemailer";
import axios from "axios";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hellocollege143@gmail.com",
    pass: "bnnv adcu kdoq bhvp",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendInactivityEmails() {
  const students = await Student.find({ auto_email_disabled: false });
  const now = Date.now() / 1000; 
  const sevenDays = 7 * 24 * 60 * 60;

  for (const student of students) {
    if (!student.cf_handle || !student.email) continue;

    try {
      const response = await axios.get(`https://codeforces.com/api/user.status?handle=${student.cf_handle}`);
      const submissions = response.data.result;

      const recentSubmission = submissions.find(sub => (now - sub.creationTimeSeconds) < sevenDays);

      if (!recentSubmission) {
        const mailOptions = {
          from: '"College Bot" <hellocollege143@gmail.com>',
          to: student.email,
          subject: "We Miss You on Codeforces!",
          text: `Hi ${student.name},\n\nIt looks like you haven't submitted any problems on Codeforces in the past week. Keep practicing to improve your skills!\n\nBest,\nYour College Team`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`📧 Sent inactivity email to ${student.email}`);
        } catch (error) {
          console.error(`❌ Failed to send email to ${student.email}:`, error.message);
        }

        student.reminder_count += 1;
        await student.save();
      }
    } catch (error) {
      console.error(`❌ Failed to fetch submissions for ${student.cf_handle}:`, error.message);
    }
  }
}
