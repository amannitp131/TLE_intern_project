import cron from "node-cron";
import  Student  from "../config/models/Student.js";
import axios from "axios";



// to fetch Codeforces user profile info
async function fetchCFUserInfo(handle) {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.info?handles=${handle}`);
        const user = res.data.result[0];
        return {
            rating: user.rating || null,
            maxRating: user.maxRating || null,
            rank: user.rank || null,
            maxRank: user.maxRank || null
        };
    } catch (error) {
        console.error(`Error fetching user info for ${handle}:`, error.message);
        return {
            rating: null,
            maxRating: null,
            rank: null,
            maxRank: null
        };
    }
}

// to fetch contests participated by the user
async function fetchCFContests(handle) {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
        return res.data.result.length;
    } catch (error) {
        console.error(`Error fetching contests for ${handle}:`, error.message);
        return 0;
    }
}

// to fetch solved problems
async function fetchCFProblems(handle) {
    try {
        const res = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
        const solvedSet = new Set();
        for (const sub of res.data.result) {
            if (sub.verdict === "OK") {
                const problemId = `${sub.problem.contestId}-${sub.problem.index}`;
                solvedSet.add(problemId);
            }
        }
        return solvedSet.size;
    } catch (error) {
        console.error(`Error fetching problems for ${handle}:`, error.message);
        return 0;
    }
}

// Main function
async function fetchAndStoreCFDataForAllStudents() {
    try {
        const students = await Student.find();
        console.log("Found students:", students.length);

        for (const student of students) {
            const handle = student.cf_handle;
            if (!handle) continue;

            console.log(`Syncing for: ${handle}`);

            const [userInfo, contests, problems] = await Promise.all([
                fetchCFUserInfo(handle),
                fetchCFContests(handle),
                fetchCFProblems(handle)
            ]);

            console.log(`Fetched → Rating: ${userInfo.rating}, MaxRating: ${userInfo.maxRating}, Rank: ${userInfo.rank}, MaxRank: ${userInfo.maxRank}, Contests: ${contests}, Solved: ${problems}`);

            await Student.findByIdAndUpdate(student._id, {
                current_rating: userInfo.rating,
                max_rating: userInfo.maxRating,
                current_rank: userInfo.rank,
                max_rank: userInfo.maxRank,
                cf_contests: contests,
                cf_problems_solved: problems,
                last_synced: new Date()
            });

            console.log(`✅ Updated CF data for ${handle}`);
        }
    } catch (err) {
        console.error("Error in CF data sync:", err);
    }
}

// Schedule the task to run daily at 2 AM
cron.schedule("0 2 * * *", fetchAndStoreCFDataForAllStudents);

// 🔁 TEMP: Trigger immediately for testing
fetchAndStoreCFDataForAllStudents();

export default fetchAndStoreCFDataForAllStudents;
