"use client";
import { useState, useEffect } from "react";
import { Download, Calendar, Filter } from "lucide-react";
import api from "@/lib/api";

interface OrdersHeadlineProps {
  title:     string;
  value:     string | number;
  subtitle:  string;
  icon:      React.ReactNode;
  iconBg:    string;
  textColor: string;
}

const OrdersHeadline = ({ title, value, subtitle, icon, iconBg, textColor }: OrdersHeadlineProps) => (
  <div className="bg-secondary p-6 rounded-2xl shadow-sm flex justify-between items-start">
    <div>
      <p className="text-sm text-muted-text mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-primary-text mb-1">{value}</h3>
      <p className={`text-sm font-medium ${textColor}`}>{subtitle}</p>
    </div>
    <div className={`p-3 rounded-xl ${iconBg} ${textColor}`}>
      {icon}
    </div>
  </div>
);

export default function OrdersStats() {
  const [totalSales,    setTotalSales]    = useState("EGP 0");
  const [totalOrders,   setTotalOrders]   = useState(0);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, perfRes] = await Promise.all([
          api.get("/Orders"),
          api.get("/BusinessPerformance"),
        ]);

        const orders = ordersRes.data;
        const perf   = perfRes.data;

        setTotalOrders(orders.length ?? 0);
        setTotalSales(`EGP ${perf.totalNetProfit ?? 0}`);
      } catch (err) {
        console.error("Failed to fetch orders stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-2xl font-black text-primary-text">Orders & Reports</h1>
        <p className="text-muted-text text-sm">Track sales orders and generate reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <OrdersHeadline
          title="Total Sales"
          value={loading ? "..." : totalSales}
          subtitle={loading ? "Loading..." : `From ${totalOrders} orders`}
          icon={<Download size={20} />}
          iconBg="bg-softgreen/20"
          textColor="text-darkgreen"
        />
        <OrdersHeadline
          title="Total Orders"
          value={loading ? "..." : totalOrders}
          subtitle="Successfully processed"
          icon={<Calendar size={20} />}
          iconBg="bg-softblue/20"
          textColor="text-darkblue"
        />
        <OrdersHeadline
          title="Net Profit"
          value={loading ? "..." : totalSales}
          subtitle="Total net earnings"
          icon={<Filter size={20} />}
          iconBg="bg-softyellow/20"
          textColor="text-darkyellow"
        />
      </div>
    </div>
  );
}