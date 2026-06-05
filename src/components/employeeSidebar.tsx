"use client";
import { useEffect, useState } from "react";
import { getMyProfile } from "@/services/authService";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { User, LogOut } from "lucide-react";

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
  const router   = useRouter();
  const [email, setEmail]   = useState("");
  const [name, setName]     = useState("");
  const [role, setRole]     = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setEmail(profile.email          ?? "");
        setName(profile.employee_Name   ?? "");
        setRole(profile.employee_Role   ?? "");
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    document.cookie = "userToken=; path=/; max-age=0";
    router.push("/login");
  };

  return (
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
            const Icon     = item.icon;
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
           {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-darkred hover:bg-softred/10 transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Logout</span>
        </button>
        </div>
      </nav>

      {/* Profile + Logout */}
      <div className="mt-auto pt-4 space-y-2">
        
        {/* Profile Card */}
        <div className="flex items-center gap-3 p-2 bg-secondary rounded-xl">
          <div className="w-10 h-10 rounded-full bg-mintgreen/10 flex items-center justify-center shrink-0">
            <User size={20} className="text-mintgreen" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-primary-text truncate">
              {loading ? "Loading..." : name}
            </p>
            <p className="text-xs text-muted-text truncate">
              {loading ? "..." : email}
            </p>
            {role && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                role === "Admin"
                  ? "bg-mintgreen/10 text-mintgreen"
                  : "bg-softblue/20 text-darkblue"
              }`}>
                {role}
              </span>
            )}
          </div>
        </div>

       
      </div>
    </aside>
  );
};

export default Sidebar;