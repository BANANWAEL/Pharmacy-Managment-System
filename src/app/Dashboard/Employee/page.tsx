"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/services/authService";
import SalesReport from "@/components/Employee/Home/salereport";
import MonthlyProgress from "@/components/Employee/MonthlyProgress";
import RecentOrders from "@/components/Employee/RecentOrders";
import TotalEarnings from "@/components/Employee/TotalEarnings";
import ExpiringList from "@/components/Employee/expiringlist";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        // ✅ Wait for token to be available
        const token = localStorage.getItem("userToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const profile = await getMyProfile();
        console.log("Employee guard:", profile.employee_Role);

        if (profile.employee_Role === "Pharmacist") {
          setAuthorized(true); // ✅ only render if correct role
        } else if (profile.employee_Role === "Admin") {
          router.push("/Dashboard/Manager");
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Guard error:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  // ✅ Don't render ANYTHING until authorized
  if (loading) return <div>Loading...</div>;
  if (!authorized) return null;

  return (
    <div className="flex flex-col w-full gap-3">
      <SalesReport />
      <div className="grid grid-col-2 md:grid-cols-2 gap-2 mt-auto">
        <ExpiringList />
        <RecentOrders />
      </div>
      <div className="grid grid-col-2 md:grid-cols-2 gap-2 mt-auto">
        <MonthlyProgress />
        <TotalEarnings />
      </div>
    </div>
  );
}