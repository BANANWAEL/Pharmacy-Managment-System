"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. مسح التوكن من localStorage
    localStorage.removeItem("userToken");
    // 2. (اختياري) مسح أي بيانات أخرى مثل remember me
    // localStorage.removeItem("rememberMe");
    
    // 3. إعادة التوجيه إلى صفحة الدخول
    router.push("/login");
  };

  return (
    <button
                type="button"
                onClick={handleLogout}
                className="flex-1 px-4 py-2 border border-red-300 dark:border-red-700 text-darkred rounded-lg hover:bg-softred/10 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
   
  );
}