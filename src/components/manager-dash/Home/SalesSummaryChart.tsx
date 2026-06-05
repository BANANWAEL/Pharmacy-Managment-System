"use client";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "@/lib/api";

const staticData = [
  { name: "Jan", sales: 45000 },
  { name: "Feb", sales: 52000 },
  { name: "Mar", sales: 48000 },
  { name: "Apr", sales: 61000 },
  { name: "May", sales: 55000 },
  { name: "Jun", sales: 67000 },
  { name: "Jul", sales: 72000 },
  { name: "Aug", sales: 69000 },
  { name: "Sep", sales: 76000 },
  { name: "Oct", sales: 82000 },
  { name: "Nov", sales: 79000 },
  { name: "Dec", sales: 86000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary text-primary-text p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold">{label}</p>
        <p className="text-mintgreen">
          Sales: <span className="font-bold">EGP {payload[0].value.toLocaleString()}</span>
        </p>
      </div>
    );
  }
  return null;
};

const SalesSummaryChart = () => {
  const [chartData, setChartData] = useState(staticData);
  const [isRealData, setIsRealData] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await api.get("/SalesTimeline");
        const data     = response.data;

        if (data.last4WeeksDetail && data.last4WeeksDetail.length > 0) {
          const mapped = data.last4WeeksDetail.map((item: any) => ({
            name:  item.weekLabel,   // "Week 1"
            sales: item.totalAmount, // 0
          }));

          const hasRealValues = mapped.some((item: any) => item.sales > 0);
          if (hasRealValues) {
            setChartData(mapped);
            setIsRealData(true);
            setYear(new Date().getFullYear());
          }
          // if all zeros → keeps staticData as fallback
        }
      } catch (err) {
        console.error("Failed to fetch sales summary:", err);
      }
    };

    fetchTimeline();
  }, []);

  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-sm h-[400px] w-full">
      <div className="flex items-center justify-between mb-4 ps-3">
        <h2 className="font-bold text-primary-text">
          {isRealData ? "Sales Summary (Last 4 Weeks)" : `Sales Summary (${year})`}
        </h2>
        {!isRealData && (
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-muted-text">
            Sample Data
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--muted-text)"
            strokeOpacity={0.2}
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-text)", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-text)", fontSize: 12 }}
            tickFormatter={(value) =>
              value >= 1000 ? `EGP ${value / 1000}k` : `EGP ${value}`
            }
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "var(--muted-text)", strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => (
              <span className="text-primary-text text-sm">{value}</span>
            )}
          />
          <Line
            name="Sales (EGP)"
            type="monotone"
            dataKey="sales"
            stroke="var(--mintgreen)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--mintgreen)", strokeWidth: 2, stroke: "var(--background)" }}
            activeDot={{ r: 6, fill: "var(--mintgreen)", stroke: "var(--background)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesSummaryChart;