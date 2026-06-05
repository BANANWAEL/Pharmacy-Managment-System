"use client";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, ShoppingCart, AlertTriangle, LucideIcon } from "lucide-react";
import api from "@/lib/api";

interface StatItem {
  title:     string;
  value:     string;
  trend:     string;
  icon:      LucideIcon;
  textColor: string;
  iconBg:    string;
}

const staticStats: StatItem[] = [
  { title: "Today's Sales",       value: "EGP 12,450", trend: "+12.5%",  icon: DollarSign,    textColor: "text-mintgreen", iconBg: "bg-mintgreen/10" },
  { title: "Monthly Sales",       value: "EGP 85,000", trend: "+8.2%",   icon: TrendingUp,    textColor: "text-darkblue",  iconBg: "bg-darkblue/10"  },
  { title: "Total Orders",        value: "234",         trend: "+5.1%",   icon: ShoppingCart,  textColor: "text-mintgreen", iconBg: "bg-mintgreen/10" },
  { title: "Low-Stock Medicines", value: "4",           trend: "Critical",icon: AlertTriangle, textColor: "text-darkred",   iconBg: "bg-darkred/10"   },
];

export default function HomeCards() {
  const [stats, setStats] = useState<StatItem[]>(staticStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [perfRes, alertRes, timelineRes] = await Promise.all([
          api.get("/BusinessPerformance"),
          api.get("/InventoryAlerts/status"),
          api.get("/SalesTimeline"),
        ]);

        const perf     = perfRes.data;
        const alerts   = alertRes.data;
        const timeline = timelineRes.data;

        setStats([
          {
            title:     "Today's Sales",
            value:     `EGP ${timeline.todaySales ?? 0}`,
            trend:     timeline.todaySales > 0 ? "+live" : "No sales yet",
            icon:      DollarSign,
            textColor: "text-mintgreen",
            iconBg:    "bg-mintgreen/10",
          },
          {
            title:     "Monthly Sales",
            value:     `EGP ${timeline.thisMonthSales ?? 0}`,
            trend:     timeline.thisMonthSales > 0 ? "+live" : "No sales yet",
            icon:      TrendingUp,
            textColor: "text-darkblue",
            iconBg:    "bg-darkblue/10",
          },
          {
            title:     "Total Orders",
            value:     `${perf.totalOrders ?? 0}`,
            trend:     perf.totalOrders > 0 ? `${perf.totalOrders} orders` : "No orders yet",
            icon:      ShoppingCart,
            textColor: "text-mintgreen",
            iconBg:    "bg-mintgreen/10",
          },
          {
            title:     "Low-Stock Medicines",
            value:     `${alerts.lowStock?.length ?? 0}`,
            trend:     alerts.lowStock?.length > 0 ? "Critical" : "All good",
            icon:      AlertTriangle,
            textColor: alerts.lowStock?.length > 0 ? "text-darkred" : "text-softgreen",
            iconBg:    alerts.lowStock?.length > 0 ? "bg-darkred/10" : "bg-softgreen/10",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch home cards:", err);
        // keeps staticStats as fallback
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-secondary p-5 rounded-2xl shadow-sm flex justify-between items-start"
        >
          <div className="flex flex-col">
            <span className="text-muted-text text-[13px] font-medium mb-1">{item.title}</span>
            <span className="text-2xl font-bold text-primary-text mb-2">{item.value}</span>
            <span className={`text-[12px] font-bold ${item.textColor}`}>{item.trend}</span>
          </div>
          <div className={`p-3 rounded-2xl ${item.iconBg}`}>
            <item.icon size={22} className={item.textColor} />
          </div>
        </div>
      ))}
    </div>
  );
}