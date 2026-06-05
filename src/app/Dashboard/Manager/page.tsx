//Manager/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyProfile } from "@/services/authService";
import HomeCards from "@/components/manager-dash/Home/cards";
import CriticalStockWarnings from "@/components/manager-dash/Home/CriticalStockWarnings";
import ExpiringMedicines from "@/components/manager-dash/Home/ExpiringMedicenes";
import SalesSummaryChart from "@/components/manager-dash/Home/SalesSummaryChart";
import Topbar from "@/components/manager-dash/Home/topbar";
import TopSellingChart from "@/components/manager-dash/Home/TopSellingChart";

export default function ManagerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          router.push("/login");
          return;
        }

        const profile = await getMyProfile();

        if (profile.employee_Role === "Admin") {
          setAuthorized(true);
        } else if (profile.employee_Role === "Pharmacist") {
          router.push("/Dashboard/Employee");
        } else {
          router.push("/login");
        }
      } catch (err) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  return (
    <div className="">
      <Topbar />
      <HomeCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-2">
        <ExpiringMedicines />
        <CriticalStockWarnings />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
        <SalesSummaryChart />
        <TopSellingChart />
      </div>
    </div>
  );
}
