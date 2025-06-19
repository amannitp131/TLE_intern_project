"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // On mount, set theme from localStorage or default to dark
    const stored = localStorage.getItem("theme");
    if (stored === null || stored === "1") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "1");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "1");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "0");
    }
    window.location.reload();
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-md hover:scale-105 transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-300" />}
    </button>
  );
}