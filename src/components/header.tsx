"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Search, Bell, Menu, User } from "lucide-react";

// التعديل الوحيد: تعريف الـ Props عشان تستخدميه في الـ Layout

interface HeaderProps {
  title?: string;
  userName?: string;
  onMenuClick?: () => void;
}
export default function Header({ userName = "Banan Wael" ,onMenuClick}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState("");
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const currentPath = pathname.split("/").pop() || "Overview";
  const formattedPath = currentPath
    .replace(/-/g, " ")
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());

  useEffect(() => {
    setDate(
      new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    );
  }, []);

  if (!mounted) {
    return (
      <header className="h-16 bg-background border-b border-gray-100 dark:border-gray-800" />
    );
  }

  return (
    // نفس الكلاسات الأصلية بتاعتك بالظبط
    <header className="bg-background ">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="hidden md:flex items-center text-sm font-medium min-w-0">
              <span className="text-gray-400 dark:text-gray-500">
                {pathname.includes("dashboard") ? "Dashboard" : "App"} /
              </span>
              <span className="text-blue-500 dark:text-blue-400 ml-2 truncate">
                {formattedPath}
              </span>
            </div>

            <h1 className="md:hidden text-base font-semibold text-primary-text truncate">
              {formattedPath}
            </h1>
          </div>

          {/* Center: Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-xl text-sm text-primary-text placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Theme Toggle */}
            <div className="hidden sm:flex items-center bg-secondary p-1 rounded-lg">
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${theme === "light" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
              >
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${theme === "dark" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"}`}
              >
                Dark
              </button>
            </div>

            {/* 2. نسخة الموبايل (Icon) */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="sm:hidden p-2 bg-secondary rounded-lg"
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>

            {/* Notifications - هتختفي في الموبايل الصغير (hidden sm:block) */}
            <button className="hidden sm:block relative p-2 bg-secondary rounded-lg">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>

            {/* User Profile */}
            <div className="flex items-center bg-secondary rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-mintgreen/10 flex items-center justify-center">
                  <User size={16} className="text-mintgreen" />
                </div>
                <span className="hidden md:block text-sm font-semibold text-primary-text whitespace-nowrap">
                  {userName}
                </span>
              </div>
              <div className="hidden sm:block px-3 py-2 text-xs font-medium text-muted-text">
                {date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
