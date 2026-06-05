// src/app/dashboard/layout.tsx
"use client";
import Sidebar from "@/components/employeeSidebar";
import Header from "@/components/header";
import { useState } from "react";

import {
  Home,
  Clock,
  PlusCircle,
  Briefcase,
  ClipboardList
} from "lucide-react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const employeeLinks = [
    {
      name: "Dashboard",
      path: "/Dashboard/Employee",
      icon: Home ,
    },
    {
      name: "My Shift",
      path: "/Dashboard/Employee/shift",
      icon: Clock ,
    },
    {
      name: "Add New Medication Category",
      path: "/Dashboard/Employee/AddCategory",
      icon: PlusCircle ,
    },
    {
      name: "Career",
      path: "/Dashboard/Employee/Career",
      icon: Briefcase ,
    },
    {
      name: "Inventory Check",
      path: "/Dashboard/Employee/EnventoryCheck",
      icon: ClipboardList  ,
    },
  ];
  return (
   <div className="flex h-screen overflow-hidden">
      {/* 1. السايدبار الثابت على الشمال */}
  <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar menuItems={employeeLinks} />{" "}
      </div>
{isSidebarOpen && (
    <div 
      className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
      onClick={() => setIsSidebarOpen(false)} // هذا هو الجزء المسؤول عن القفل
    />
  )}
      {/* 2. منطقة المحتوى (اليمين) */}
      <div className="flex-1 flex flex-col h-screen lg:ml-64 transition-all duration-300">
        {/* الهيدر ثابت فوق المحتوى */}
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Employee Dashboard"  />
        {/* المحتوى اللي بيتغير */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}


