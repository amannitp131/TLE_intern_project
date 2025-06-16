import cron from "node-cron";
import Student from "../config/models/Student.js";

async function fetchAndStoreCFDataForAllStudents() {
    const students = await Student.find();
    for (const student of students) {
        // Fetch and update rating, contests, problems, submissions
        // Update last_synced

    }
}

cron.schedule("0 2 * * *", fetchAndStoreCFDataForAllStudents);

export default fetchAndStoreCFDataForAllStudents;
