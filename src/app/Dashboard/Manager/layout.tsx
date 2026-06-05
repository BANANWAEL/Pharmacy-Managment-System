"use client";
import { useState } from "react";
import Sidebar from "@/components/employeeSidebar";
import Header from "@/components/header";
import { LayoutDashboard, Pill, FileText, UserCog } from "lucide-react";
interface LayoutProps {
  children: React.ReactNode;
}
export default function ManagerLayout({ children }: LayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const ManagerLinks = [
    { name: "Dashboard", path: "/Dashboard/Manager", icon: LayoutDashboard },
    {
      name: "Pharmacy Management",
      path: "/Dashboard/Manager/PharmacyManagement",
      icon: Pill,
    },
    {
      name: "Orders & Reports",
      path: "/Dashboard/Manager/Orders&Reports",
      icon: FileText,
    },
    {
      name: "Profile & Settings",
      path: "/Dashboard/Manager/Profile&Settings",
      icon: UserCog,
    },
  ];

  return (
   <div className="flex h-screen overflow-hidden">
  
  {/* السايدبار (Z-50) */}
  <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
    <Sidebar menuItems={ManagerLinks}/>
  </div>

  {/* الـ Overlay (Z-40) - ده اللي لما ندوس عليه يقفل السايدبار */}
  {isSidebarOpen && (
    <div 
      className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
      onClick={() => setIsSidebarOpen(false)} // هذا هو الجزء المسؤول عن القفل
    />
  )}

  {/* المحتوى */}
  <div className="flex-1 flex flex-col h-screen lg:ml-64 transition-all duration-300">
    <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Manager Dashboard" />
    <main className="flex-1 overflow-y-auto p-6">{children}</main>
  </div>
</div>
  );
}
