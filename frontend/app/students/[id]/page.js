"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import { MdHistory } from "react-icons/md";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart, Bar
} from "recharts";
import { Import } from "lucide-react";
import Image from "next/image";


export default function StudentProfilePage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [contestHistory, setContestHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [filterContestDays, setFilterContestDays] = useState(90);
  const [loading, setLoading] = useState(true);
  const [problemStats, setProblemStats] = useState(null);
  const [filterProblemsDays, setFilterProblemsDays] = useState(30);
  const [showProblems, setShowProblems] = useState(false);
   const [autoEmailDisabled, setAutoEmailDisabled] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
    const [savedTheme, setSavedTheme] = useState("light");
      const [theme, setTheme] = useState("0");

  // Initial fetch of student data, contests and problems
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-student/${id}`
        );
        const data = await res.json();
        setStudent(data);
        // console.log("Student Data:", data);

        const contestRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contests/${data.cf_handle}`
        );
        const contestData = await contestRes.json();
        setContestHistory(contestData.contests || []);
        // console.log("Contest History:", contestData.contests);

        const problemsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${data.cf_handle}?days=${filterProblemsDays}`
        );
        const problemsData = await problemsRes.json();
        setProblemStats(problemsData || []);
        // console.log("Problem Stats:", problemsData);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch student profile", err);
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

    useEffect(() => {
    const stored = localStorage.getItem("theme");
    setTheme(stored || "0");
  }, []);


  useEffect(() => {
  // Theme setup (runs only once)
  const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
  setSavedTheme(theme);

  if (student && student._id) {
    // Debug log
    console.log("Student ID:", student._id);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inactivity/fetch-auto-email/${student._id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch auto-email status");
        return res.json();
      })
      .then(data => setAutoEmailDisabled(data.auto_email_disabled))
      .catch(err => {
        console.error("Error fetching auto-email status", err);
        setAutoEmailDisabled(false);
      });

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inactivity/reminder-count/${student._id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch reminder count");
        return res.json();
      })
      .then(data => setReminderCount(data.reminder_count))
      .catch(err => {
        console.error("Error fetching reminder count", err);
        setReminderCount(0);
      });
  }
}, [student]);

  // Fetch problems separately when filters change
  useEffect(() => {
    // console.log("Fetching problems with filter:", filterProblemsDays);
    const fetchProblems = async () => {
      try {
        // console.log("Fetching problems for:", student?.cf_handle, "Days:", filterProblemsDays);
        if (student?.cf_handle) {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${student.cf_handle}?days=${filterProblemsDays}`
          );
          const data = await res.json();
          setProblemStats(data || []);
          // console.log("Problem Stats:", data);
        }
      } catch (err) {
        console.error("Failed to fetch problems", err);
        setProblemStats(null);
      }
    };




    if (showProblems && student?.cf_handle) {
      fetchProblems();
    }
  }, [showProblems, filterProblemsDays, student]);

  const changeProblemDays = (days) => {
    setFilterProblemsDays(days);
    setShowProblems(true);
  };


 if (loading || !student) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <Image src="/Loader.gif" alt="Loading..." width={224} height={284} />
    </div>
  );
}

   const  handleToggleAutoEmail = async () => {
  if (!student || !student._id) return;

  setLoading(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/inactivity/auto-email/${student._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ disable: !autoEmailDisabled }),
    });
    if (!res.ok) throw new Error("Network response was not ok");
    const data = await res.json();
    setAutoEmailDisabled(data.auto_email_disabled);
  } catch (err) {
    console.error("Failed to toggle auto-email", err);
  }
  setLoading(false);
};

  // Filter contests by selected days
  const now = new Date();
  const filteredContests = contestHistory.filter((contest) => {
    const contestDate = new Date(contest.time);
    const diffDays = (now - contestDate) / (1000 * 60 * 60 * 24);
    return diffDays <= filterContestDays;
  });

  const graphData = [...filteredContests]
    .sort((a, b) => new Date(a.time) - new Date(b.time))
    .map((c) => ({
      name: new Date(c.time).toLocaleDateString(),
      rating: c.newRating,
    }));

  return (
   <div className={`p-4 min-h-screen ${theme === "1" ? "bg-black text-white" : "bg-white text-black"}`}>
<div className={`mb-6 rounded-2xl p-6 shadow-lg border backdrop-blur-md transition-all duration-300 
  ${theme === "1" ? "bg-gray-800/50 border-gray-700 text-white" : "bg-white/80 border-gray-200 text-gray-900"}`}>
  
  <h2 className="text-3xl font-semibold mb-4 text-indigo-500">{`${student.name}'s Profile`}</h2>

  <div className="space-y-2 text-base leading-relaxed">
    {student.email && (
      <p><span className="font-medium text-gray-500">Email:</span> {student.email}</p>
    )}

    {student.phone && (
      <p><span className="font-medium text-gray-500">Mobile:</span> {student.phone}</p>
    )}

    {student.cf_handle && (
      <p><span className="font-medium text-gray-500">CF Handle:</span> {student.cf_handle}</p>
    )}

   
<div className="flex flex-wrap gap-4 my-4">
  <div className="flex-1 min-w-[150px] bg-blue-100 text-blue-800 rounded-lg p-4 shadow text-center">
    <div className="text-sm font-medium">Current Rating</div>
    <div className="text-xl font-bold">{student.current_rating} <span className="text-xs">({student.current_rank})</span></div>
  </div>
  <div className="flex-1 min-w-[150px] bg-green-100 text-green-800 rounded-lg p-4 shadow text-center">
    <div className="text-sm font-medium">Max Rating</div>
    <div className="text-xl font-bold">{student.max_rating} <span className="text-xs">({student.max_rank})</span></div>
  </div>
  <div className="flex-1 min-w-[150px] bg-yellow-100 text-yellow-800 rounded-lg p-4 shadow text-center">
    <div className="text-sm font-medium">Contests</div>
    <div className="text-xl font-bold">{student.cf_contests}</div>
  </div>
  <div className="flex-1 min-w-[150px] bg-purple-100 text-purple-800 rounded-lg p-4 shadow text-center">
    <div className="text-sm font-medium">Problems Solved</div>
    <div className="text-xl font-bold">{student.cf_problems_solved}</div>
  </div>
  <div className="flex items-center">
    <a
      href={`https://codeforces.com/profile/${student.cf_handle}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        type="button"
      >
        View Profile
      </button>
    </a>
  </div>
</div>
  

   
   
  </div>
</div>


  {/* Toggle Button and Count */}
  <div className="mt-4 flex items-center gap-4">
    <button
      className={`px-4 py-2 rounded font-semibold ${autoEmailDisabled ? "bg-red-500" : "bg-green-500"} text-white ${loading ? "opacity-50" : ""}`}
      onClick={handleToggleAutoEmail}
      disabled={loading}
    >
      Inactivity Mail: {autoEmailDisabled ? "OFF" : "ON"}
    </button>
    <span className={`text-sm ${theme === "1" ? "text-gray-300" : "text-gray-700"}`}>
      Reminder Emails Sent: <strong>{reminderCount}</strong>
    </span>
  </div>

  {/* Contest History */}
  <div className={`border rounded mt-5 shadow ${theme === "1" ? "bg-gray-900" : "bg-gray-50"}`}>
    <button
      className={`w-full flex justify-between items-center px-4 py-2 font-semibold text-lg transition ${theme === "1" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
      onClick={() => setShowStats(!showStats)}
    >
      <span>
        <MdHistory className="inline-block text-3xl" /> Contest History
      </span>
      {showStats ? (
        <FiChevronUp className="text-xl" />
      ) : (
        <FiChevronDown className="text-xl" />
      )}
    </button>

    {showStats && (
      <div className={`p-4 space-y-4 ${theme === "1" ? "text-gray-300" : "text-gray-700"}`}>
        <div className="flex gap-4">
          {[30, 90, 365].map((days) => (
            <button
              key={days}
              className={`px-4 py-2 rounded ${filterContestDays === days
                ? "bg-blue-600 text-white"
                : theme === "1"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => setFilterContestDays(days)}
            >
              Last {days} Days
            </button>
          ))}
        </div>

        {/* Rating Graph */}
        {
          filteredContests.length > 0 ? (
            graphData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={graphData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rating" stroke="#1f77b4" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-red-500">
                No contest data found for selected range.
              </p>
            )
          ) : loading ? (
            <p className="text-gray-500">Loading contest data...</p>
          ) : (
            <p className="text-gray-500">
              No contests found in the last {filterContestDays} days.
            </p>
          )
        }

        {/* Contest List */}
        {
          filteredContests.length > 0 && (
            <div className="overflow-x-auto">
              <table className={`min-w-full border ${theme === "1" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-black border-gray-300"}`}>
                <thead>
                  <tr className={theme === "1" ? "bg-gray-700" : "bg-gray-200"}>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Contest</th>
                    <th className="px-4 py-2 border">Rank</th>
                    <th className="px-4 py-2 border">Old</th>
                    <th className="px-4 py-2 border">New</th>
                    <th className="px-4 py-2 border">Change</th>
                    <th className="px-4 py-2 border">Unsolved</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContests.map((contest, index) => {
                    return (
                      <tr
                        key={index}
                        className={theme === "1" ? "hover:bg-gray-800" : "hover:bg-gray-50"}
                      >
                        <td className="px-4 py-2 border">
                          {new Date(contest.time).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 border">
                          {contest.contestName}
                        </td>
                        <td className="px-4 py-2 border">{contest.rank}</td>
                        <td className="px-4 py-2 border">
                          {contest.oldRating}
                        </td>
                        <td className="px-4 py-2 border">
                          {contest.newRating}
                        </td>
                        <td
                          className={`px-4 py-2 border border-white ${contest.ratingChange >= 0
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                        >
                          {contest.ratingChange >= 0 ? "+" : ""}
                          {contest.ratingChange}
                        </td>
                        <td className="px-4 py-2 border">{contest.unsolvedProblems}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    )}
  </div>

  {/* Problem Solving Stats */}
  <div className={`border rounded mt-5 shadow ${theme === "1" ? "bg-gray-900" : "bg-gray-50"}`}>
    <button
      className={`w-full flex justify-between items-center px-4 py-2 font-semibold text-lg transition ${theme === "1" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
      onClick={() => setShowProblems(!showProblems)}
    >
      <span>
        <MdHistory className="inline-block text-3xl" /> Problem Solving Data
      </span>
      {showProblems ? (
        <FiChevronUp className="text-xl" />
      ) : (
        <FiChevronDown className="text-xl" />
      )}
    </button>

    {showProblems && (
      <div className={`p-4 space-y-4 ${theme === "1" ? "text-gray-300" : "text-gray-700"}`}>
        <div className="flex gap-4">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              className={`px-4 py-2 rounded ${filterProblemsDays === days
                ? "bg-blue-600 text-white"
                : theme === "1"
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-200 text-gray-700"
                }`}
              onClick={() => setFilterProblemsDays(days)}
            >
              Last {days} Days
            </button>
          ))}
        </div>

        {/* Problems Data */}
        {problemStats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {
                problemStats.totalProblems && (<div className={`p-4 rounded shadow ${theme === "1" ? "bg-gray-900" : "bg-white"}`}>
                  <p className={`text-sm ${theme === "1" ? "text-gray-400" : "text-gray-600"}`}>Total Solved</p>
                  <p className="text-lg font-bold">{problemStats.totalSolved}</p>
                </div>
                )
              }
              <div className={`p-4 rounded shadow ${theme === "1" ? "bg-gray-900" : "bg-white"}`}>
                <p className={`text-sm ${theme === "1" ? "text-gray-400" : "text-gray-600"}`}>Avg Rating</p>
                <p className="text-lg font-bold">{problemStats.averageRating}</p>
              </div>
              <div className={`p-4 rounded shadow ${theme === "1" ? "bg-gray-900" : "bg-white"}`}>
                <p className={`text-sm ${theme === "1" ? "text-gray-400" : "text-gray-600"}`}>Avg/Day</p>
                <p className="text-lg font-bold">{problemStats.averagePerDay}</p>
              </div>
              {
                problemStats.mostDifficult && (
                  <div className={`p-4 rounded shadow ${theme === "1" ? "bg-gray-900" : "bg-white"}`}>
                    <p className={`text-sm ${theme === "1" ? "text-gray-400" : "text-gray-600"}`}>Hardest Problem</p>
                    {problemStats.mostDifficult.name} ({problemStats.mostDifficult.rating})
                  </div>
                )
              }
            </div>

            {/* Rating Bucket Bar Chart */}
            {problemStats.ratingBuckets && Object.keys(problemStats.ratingBuckets).length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Problems by Rating</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={Object.entries(problemStats.ratingBuckets).map(([rating, count]) => ({
                      rating,
                      count,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Submission Heatmap */}
            {problemStats.submissionHeatmap && Object.keys(problemStats.submissionHeatmap).length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-semibold mb-2">Submission Heatmap</h4>
                <div className="grid grid-cols-7 gap-1 text-xs text-center">
                  {Array.from({ length: 90 }).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (89 - i));
                    const key = date.toISOString().split("T")[0];
                    const count = problemStats.submissionHeatmap[key] || 0;
                    return (
                      <div
                        key={key}
                        title={`${key}: ${count} submissions`}
                        className={`w-4 h-4 rounded ${count === 0
                          ? theme === "1"
                            ? "bg-gray-700"
                            : "bg-gray-200"
                          : count < 2
                            ? "bg-green-300"
                            : count < 4
                              ? "bg-green-500"
                              : "bg-green-700"
                          }`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        ) : (
          <p className="text-gray-500">No problem-solving data found.</p>
        )}

      </div>
    )}
  </div>
</div>
  );
}
