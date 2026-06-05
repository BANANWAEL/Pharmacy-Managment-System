"use client";
import { useState, useEffect } from "react";
import StatsGrid from "@/components/Employee/cards";
import { DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { getBusinessPerformance } from "@/services/dashboardService";
export default function ShiftPerformance() {
  const [currentDate, setCurrentDate] = useState("");
  const [dashboardStats, setDashboardStats] = useState([
    {
      title: "Total Sales",
      value: "...",
      change: "0%",
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Orders",
      value: "...",
      change: "0%",
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "New Customer",
      value: "...",
      change: "0%",
      icon: Users,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "New Income",
      value: "...",
      change: "0%",
      icon: Package,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]);
    useEffect(() => {
    // Date
    const date = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    setCurrentDate(date);

    // Fetch stats
    const fetchStats = async () => {
      try {
        // const data = await getBusinessPerformance();
        // console.log("BusinessPerformance response:", data); // 🔍 check keys here
        const data = await getBusinessPerformance();
        console.log("BusinessPerformance:", data);

        setDashboardStats([
          {
            title: "Total Sales",
            value: `${data.totalNetProfit} EGP`,
            change: "+22%", // static
            icon: DollarSign,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
          },
          {
            title: "Total Orders",
            value: `${data.totalOrders}`,
            change: "+10%", // static
            icon: ShoppingCart,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
          },
          {
            title: "New Customer",
            value: "1000", // static
            change: "+22%", // static
            icon: Users,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10",
          },
          {
            title: "New Income",
            value: `${data.totalNetProfit} EGP`,
            change: "+22%", // static
            icon: Package,
            color: "text-orange-500",
            bgColor: "bg-orange-500/10",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="">
      <StatsGrid
        title="Shift Performance Report"
        subtitle="Today's live statistics"
        data={dashboardStats}
      />
    </div>
  );
}
