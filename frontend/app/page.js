"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("rating");
  const [savedTheme, setSavedTheme] = useState("light");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get-students`
        );
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    };
    fetchStudents();

    // Get theme from localStorage
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
  }, []);

  const totalStudents = students.length;
  const avgContests = Math.round(
    students.reduce((sum, s) => sum + (s.cf_contests || 0), 0) /
    (students.length || 1)
  );
  const avgProblems = Math.round(
    students.reduce((sum, s) => sum + (s.cf_problems_solved || 0), 0) /
    (students.length || 1)
  );
  const minRating = Math.min(...students.map((s) => s.current_rating || 0));
  const maxRating = Math.max(...students.map((s) => s.current_rating || 0));

  // Sort leaderboard based on selected filter
  const getSortedLeaderboard = () => {
    const sorted = [...students];
    switch (filter) {
      case "rating":
        return sorted.sort((a, b) => (b.current_rating || 0) - (a.current_rating || 0));
      case "problems":
        return sorted.sort((a, b) => (b.cf_problems_solved || 0) - (a.cf_problems_solved || 0));
      case "contests":
        return sorted.sort((a, b) => (b.cf_contests || 0) - (a.cf_contests || 0));
      default:
        return sorted.sort((a, b) => (b.current_rating || 0) - (a.current_rating || 0));
    }
  };

  const sortedLeaderboard = getSortedLeaderboard();

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

  const getFilterTitle = () => {
    switch (filter) {
      case "rating":
        return "🏆 Leaderboard - Highest Rating";
      case "problems":
        return "🏆 Leaderboard - Most Problems Solved";
      case "contests":
        return "🏆 Leaderboard - Most Contests";
      default:
        return "🏆 Leaderboard";
    }
  };

  // Conditional classes
  const mainBg = savedTheme === "dark" ? "bg-black text-white" : "bg-white text-black";
  const cardBg = savedTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
  const selectBg = savedTheme === "dark" ? "bg-black text-white border-gray-700" : "bg-white text-black border-gray-300";
  const tableHeadBg = savedTheme === "dark" ? "bg-gray-800" : "bg-gray-100";

  return (
    <div className={`flex min-h-screen ${mainBg}`}>
      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Students" value={totalStudents} cardBg={cardBg} />
          <StatCard title="Min Rating" value={minRating} cardBg={cardBg} />
          <StatCard title="Max Rating" value={maxRating} cardBg={cardBg} />
          <StatCard title="Avg Contest" value={avgContests} cardBg={cardBg} />
          <StatCard title="Avg Problems Solved" value={avgProblems} cardBg={cardBg} />
        </div>

        <div className="mb-4 rounded-md">
          <label className={`mr-2 font-medium ${savedTheme === "dark" ? "text-white" : "text-black"}`}>Filter:</label>
          <select
            className={`rounded px-3 py-2 ${selectBg}`}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="rating">Highest Rating</option>
            <option value="problems">Most Problems Solved</option>
            <option value="contests">Most Contests</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-x-auto p-4 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">{getFilterTitle()}</h2>
          <table className="min-w-full text-sm md:text-base text-left">
            <thead className={`bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 ${tableHeadBg}`}>
              <tr>
                <th className="p-3 font-medium">#</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Handle</th>
                <th className="p-3 font-medium text-center">Contests</th>
                <th className="p-3 font-medium text-center">Problems</th>
                <th className="p-3 font-medium text-center">Rating</th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard.map((s, i) => (
                <tr
                  key={s._id || i}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="p-3">{getMedal(i)}</td>
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.cf_handle}</td>
                  <td className="p-3 text-center">{s.cf_contests || 0}</td>
                  <td className="p-3 text-center">{s.cf_problems_solved || 0}</td>
                  <td className="p-3 text-center">{s.current_rating || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

function StatCard({ title, value, cardBg }) {
  return (
    <div className={`rounded-xl p-4 shadow ${cardBg}`}>
      <div className="text-gray-600 dark:text-gray-400 text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}