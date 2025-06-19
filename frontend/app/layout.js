"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DarkModeToggle from "../components/UI/DarkModeToggle";
import Sidebar from "@/components/UI/Sidebar";
import { FiMenu } from "react-icons/fi";
import "./globals.css";

export default function RootLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [savedTheme, setSavedTheme] = useState("light");

  // On mount, read from localStorage and set theme
  useEffect(() => {
    const theme = localStorage.getItem("theme") === "1" ? "dark" : "light";
    setSavedTheme(theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const themeClasses =
    savedTheme === "dark"
      ? "bg-black text-white"
      : "bg-white text-black";

  return (
    <html lang="en" className={savedTheme === "dark" ? "dark" : ""}>
      <body className={`transition-colors duration-300 min-h-screen flex flex-col ${themeClasses}`}>
        <header className={`w-full shadow ${themeClasses}`}>
          <div className="w-full mx-auto px-4 md:px-10 py-4 flex items-center justify-between">
            <button
              className="md:hidden text-2xl"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu />
            </button>

            <Link href="/" passHref>
              <h1 className="text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors">
                Student Management System
              </h1>
            </Link>

            <DarkModeToggle />
          </div>
        </header>

        <div className="flex flex-1 min-h-0">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className={`flex-1 p-6 overflow-auto ${themeClasses}`}>{children}</main>
        </div>
      </body>
    </html>
  );
}
