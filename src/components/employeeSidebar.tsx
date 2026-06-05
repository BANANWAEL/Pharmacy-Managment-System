"use client";
import { useEffect, useState } from "react";
import { getMyProfile } from "@/services/authService";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User } from "lucide-react";

// تعريف شكل اللينك
export interface MenuItem {
  name: string;
  path: string;
  icon: any;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

const Sidebar = ({ menuItems }: SidebarProps) => {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        console.log("Profile:", profile);
        setEmail(profile.email); // ← adjust key based on your API response
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);
  return (
    // Responsive: w-0 lg:w-64 (بيختفي في الموبايل وبياخد مساحته في الديسكتوب)
    // تقدري تضيفي State للـ MobileMenu لاحقاً
    <aside className="w-64 h-screen bg-background border-r border-gray-200 flex flex-col p-4 fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <Image src="/image.png" alt="logo" width={20} height={30} />
        <h1 className="text-xl font-bold text-mintgreen">Appothecary</h1>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <p className="text-xs font-semibold mb-4 px-2 text-muted-text uppercase tracking-wider">
          MENU
        </p>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-mintgreen text-white shadow-md"
                    : "text-primary-text hover:bg-secondary/50 hover:text-mintgreen"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Profile */}
      <div className="mt-auto pt-4">
        <div className="flex items-center gap-3 p-2 bg-secondary rounded-xl">
          <div className="w-10 h-10 rounded-full bg-mintgreen/10 flex items-center justify-center">
            <User size={20} className="text-mintgreen" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-primary-text truncate">
              Banan Wael
            </p>
            <p className="text-xs text-muted-text truncate">
              {" "}
              {email || "Loading..."}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
