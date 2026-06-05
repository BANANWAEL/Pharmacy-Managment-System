"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import api from "@/lib/api";

const staticData = [
  { name: "Jan", value: 90 },  { name: "Feb", value: 60 },  { name: "Mar", value: 70 },
  { name: "Apr", value: 85 },  { name: "May", value: 45 },  { name: "Jun", value: 110 },
  { name: "Jul", value: 120 }, { name: "Aug", value: 75 },  { name: "Sep", value: 95 },
  { name: "Oct", value: 75 },  { name: "Nov", value: 90 },  { name: "Dec", value: 77 },
];

export default function MonthlyProgress() {
  const [showModal, setShowModal]   = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [chartData, setChartData]   = useState(staticData);
  const [isRealData, setIsRealData] = useState(false);
  const [summary, setSummary]       = useState({ today: 0, thisWeek: 0, thisMonth: 0 });

  useEffect(() => {
    setMounted(true);

    const fetchTimeline = async () => {
      try {
        const response = await api.get("/SalesTimeline");
        const data = response.data;

        // update summary stats
        setSummary({
          today:     data.todaySales     ?? 0,
          thisWeek:  data.thisWeekSales  ?? 0,
          thisMonth: data.thisMonthSales ?? 0,
        });

        if (data.last4WeeksDetail && data.last4WeeksDetail.length > 0) {
          const mapped = data.last4WeeksDetail.map((item: any) => ({
            name:  item.weekLabel,
            value: item.totalAmount,
          }));

          // only use real data if it has non-zero values
          const hasRealData = mapped.some((item: any) => item.value > 0);
          if (hasRealData) {
            setChartData(mapped);
            setIsRealData(true);
          }
          // otherwise keeps staticData as fallback
        }
      } catch (err) {
        console.error("Failed to fetch sales timeline:", err);
      }
    };

    fetchTimeline();
  }, []);

  const maxValue = Math.max(...chartData.map((d) => d.value));

  if (!mounted) return <div className="h-80 bg-secondary animate-pulse rounded-4xl"></div>;

  return (
    <>
      <div className="bg-secondary p-6 rounded-4xl shadow-sm h-80 flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg text-primary-text">Monthly Progress</h2>
            {!isRealData && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary border border-gray-200 dark:border-gray-700 text-muted-text">
                Sample Data
              </span>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-bold text-muted-text hover:text-mintgreen dark:hover:text-softgreen transition-colors"
          >
            View Details &gt;
          </button>
        </div>

        {/* Summary Stats */}
        <div className="flex gap-4 mb-3">
          <div>
            <p className="text-[10px] text-muted-text">Today</p>
            <p className="text-sm font-bold text-primary-text">{summary.today} EGP</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-text">This Week</p>
            <p className="text-sm font-bold text-primary-text">{summary.thisWeek} EGP</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-text">This Month</p>
            <p className="text-sm font-bold text-primary-text">{summary.thisMonth} EGP</p>
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-text)", fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  backgroundColor: "var(--secondary)",
                  border: "1px solid var(--darkgray)",
                  borderRadius: "12px",
                  color: "var(--primary-text)",
                }}
              />
              <Bar dataKey="value" barSize={15} radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value === maxValue ? "var(--mintgreen)" : "var(--softgreen)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="relative bg-background dark:bg-secondary w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-primary-text">Analytics Report</h2>
                <p className="text-sm text-muted-text">Detailed monthly progress and performance</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 bg-secondary dark:bg-background hover:bg-darkred/10 hover:text-darkred rounded-2xl transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Summary */}
            <div className="px-8 pt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Today's Sales",      value: summary.today },
                { label: "This Week's Sales",  value: summary.thisWeek },
                { label: "This Month's Sales", value: summary.thisMonth },
              ].map((s) => (
                <div key={s.label} className="bg-secondary/50 dark:bg-black/20 rounded-2xl p-4 text-center">
                  <p className="text-xs text-muted-text mb-1">{s.label}</p>
                  <p className="text-xl font-black text-primary-text">{s.value} EGP</p>
                </div>
              ))}
            </div>

            {/* Modal Chart */}
            <div className="p-8 overflow-y-auto">
              <div className="h-[300px] w-full bg-gray-50/50 dark:bg-black/20 rounded-4xl p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" tick={{ fill: "var(--muted-text)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "var(--muted-text)" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--secondary)",
                        border: "1px solid var(--darkgray)",
                        borderRadius: "12px",
                        color: "var(--primary-text)",
                      }}
                    />
                    <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-modal-${index}`}
                          fill={entry.value === maxValue ? "var(--mintgreen)" : "var(--softgreen)"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}