"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import api from "@/lib/api";

const staticData = [
  { name: "Total Purchase", value: 400, color: "var(--darkred)" },
  { name: "Cash Received",  value: 300, color: "var(--darkyellow)" },
  { name: "Bank Receive",   value: 300, color: "var(--darkblue)" },
  { name: "Total Service",  value: 200, color: "var(--darkgreen)" },
];

export default function TotalEarnings() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [data, setData]           = useState(staticData);
  const [netProfit, setNetProfit] = useState<number | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [isRealData, setIsRealData]   = useState(false);

  useEffect(() => {
    setMounted(true);

    const fetchEarnings = async () => {
      try {
        const response = await api.get("/BusinessPerformance");
        const d = response.data;
        console.log("BusinessPerformance (TotalEarnings):", d);

        const profit = d.totalNetProfit ?? d.total_NetProfit ?? null;
        const orders = d.totalOrders    ?? d.total_Orders    ?? null;

        if (profit !== null) {
          setNetProfit(profit);
          setTotalOrders(orders);
          setIsRealData(true);

          // update pie chart with real data if top selling medicines exist
          if (d.topSellingMedicines && d.topSellingMedicines.length > 0) {
            const colors = [
              "var(--darkred)",
              "var(--darkyellow)",
              "var(--darkblue)",
              "var(--darkgreen)",
            ];
            const mapped = d.topSellingMedicines
              .slice(0, 4)
              .map((item: any, index: number) => ({
                name:  item.medicine_Name     ?? item.medicineName ?? `Medicine ${index + 1}`,
                value: item.totalQuantitySold ?? item.quantity     ?? 0,
                color: colors[index],
              }));

            const hasRealValues = mapped.some((item: any) => item.value > 0);
            if (hasRealValues) setData(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to fetch earnings:", err);
        // keeps static as fallback
      }
    };

    fetchEarnings();
  }, []);

  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const maxItem    = data.reduce((max, item) => item.value > max.value ? item : max, data[0]);
  const percentage = totalValue > 0 ? Math.round((maxItem.value / totalValue) * 100) : 85;

  if (!mounted) return <div className="h-44 bg-secondary animate-pulse rounded-4xl"></div>;

  return (
    <>
      <div className="bg-secondary p-6 rounded-4xl shadow-sm flex items-center justify-between border border-secondary transition-all duration-300">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-muted-text text-sm font-medium mb-1">Today's Report</h2>
            {!isRealData && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-gray-200 dark:border-gray-700 text-muted-text mb-1">
                Sample
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-2xl font-black text-primary-text">
              {netProfit !== null ? `${netProfit} EGP` : "$5098.00"}
            </span>
            <span className="text-[10px] text-softgreen font-bold">↑ 35.9% Vs Last Month</span>
          </div>

          {totalOrders !== null && (
            <span className="text-[10px] text-muted-text mt-1">
              {totalOrders} Orders Total
            </span>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-[10px] font-bold text-mintgreen hover:underline text-left"
          >
            View Full Report
          </button>
        </div>

        {/* Donut Chart */}
        <div className="w-32 h-32 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={35}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[8px] text-muted-text">Earnings</span>
            <span className="text-[10px] font-bold text-primary-text">{percentage}%</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/80 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-secondary w-full max-w-lg rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-primary-text">Financial Summary</h2>
                  <p className="text-xs text-muted-text">Breakdown of today's earnings and costs</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-primary-text hover:text-darkred transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {data.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-background/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-medium text-primary-text">{item.name}</span>
                    </div>
                    <span className="font-bold text-primary-text">
                      {isRealData ? `${item.value} units` : `$${item.value}.00`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <span className="font-bold text-muted-text">Net Profit</span>
                <span className="text-xl font-black text-darkgreen">
                  {netProfit !== null ? `${netProfit} EGP` : "$3,450.00"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}