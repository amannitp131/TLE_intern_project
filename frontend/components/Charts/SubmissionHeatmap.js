"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function SubmissionHeatmap({ cf_handle }) {
  const [range, setRange] = useState(180);
  const [heatmapData, setHeatmapData] = useState({});

  useEffect(() => {
    if (!cf_handle) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems/${cf_handle}?days=${range}`
        );
        const raw = res.data.submissionHeatmap || {};

        // Normalize keys to YYYY-MM-DD
        const normalized = {};
        for (const key in raw) {
          const iso = new Date(key).toLocaleDateString("en-CA");
          normalized[iso] = raw[key];
        }

        setHeatmapData(normalized);
      } catch (err) {
        console.error("Failed to fetch heatmap data:", err);
      }
    };

    fetchData();
  }, [cf_handle, range]);

  // Generate date list from today to (today - range)
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - range + 1);

  const dateList = [];
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const iso = d.toLocaleDateString("en-CA");
    const month = d.toLocaleString("default", { month: "long" });
    const year = d.getFullYear();
    dateList.push({
      date: iso,
      count: heatmapData[iso] || 0,
      monthYear: `${month} ${year}`,
    });
  }

  // Group by month
  const grouped = {};
  dateList.forEach((item) => {
    if (!grouped[item.monthYear]) grouped[item.monthYear] = [];
    grouped[item.monthYear].push(item);
  });

  // Sort groups month-wise by date descending
  const sortedMonths = Object.entries(grouped).sort((a, b) => {
    const [monthA] = a[1].slice(-1);
    const [monthB] = b[1].slice(-1);
    return new Date(monthB.date) - new Date(monthA.date);
  });

  const getColorClass = (count) => {
    if (count >= 10) return "bg-green-700";
    if (count >= 7) return "bg-green-600";
    if (count >= 4) return "bg-green-400";
    if (count >= 1) return "bg-green-200";
    return "bg-gray-200 dark:bg-gray-700";
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 max-w-full sm:max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Submission Heatmap</h3>
        <select
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          className="mt-2 sm:mt-0 px-3 py-1.5 rounded border dark:border-gray-700 bg-white dark:bg-gray-800 text-sm dark:text-white"
        >
          <option value={30}>Last 30 Days</option>
          <option value={180}>Last 6 Months</option>
          <option value={365}>Last 1 Year</option>
        </select>
      </div>

      <div className="space-y-5">
        {sortedMonths.map(([monthYear, days]) => (
          <div key={monthYear}>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{monthYear}</h4>
            <div className="grid grid-cols-7 sm:grid-cols-14 gap-[6px] gap-y-[15px] text-xs">
              {[...days].reverse().map(({ date, count }) => (
                <div
                  key={date}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-sm cursor-pointer relative group ${getColorClass(count)}`}
                >
                  <div className="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2">
                    {date}: {count} submissions
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
