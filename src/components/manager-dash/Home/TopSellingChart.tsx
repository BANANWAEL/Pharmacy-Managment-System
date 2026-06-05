// "use client";
// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// const data = [
//   { name: 'Paracetamol', units: 1250 },
//   { name: 'Ibuprofen', units: 980 },
//   { name: 'Amoxicillin', units: 750 },
//   { name: 'Metformin', units: 620 },
//   { name: 'Vitamin D3', units: 580 },
// ];

// // Custom tooltip that respects dark mode
// const CustomTooltip = ({ active, payload, label }: any) => {
//   if (active && payload && payload.length) {
//     return (
//       <div className="bg-secondary text-primary-text p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
//         <p className="font-semibold">{label}</p>
//         <p className="text-mintgreen">
//           Units Sold: <span className="font-bold">{payload[0].value}</span>
//         </p>
//       </div>
//     );
//   }
//   return null;
// };

// const TopSellingChart = () => {
//   return (
//     <div className="bg-secondary p-6 rounded-2xl  shadow-sm h-[400px] w-full">
//       <h2 className="font-bold text-primary-text mb-4 ps-3">Top-Selling Medicines</h2>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
//           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--muted-text)" strokeOpacity={0.2} />
//           <XAxis 
//             dataKey="name" 
//             axisLine={false} 
//             tickLine={false} 
//             tick={{ fill: 'var(--muted-text)', fontSize: 12 }}
//             dy={10}
//           />
//           <YAxis 
//             axisLine={false} 
//             tickLine={false} 
//             tick={{ fill: 'var(--muted-text)', fontSize: 12 }} 
//           />
//           <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--background)' }} />
//           <Legend 
//             verticalAlign="bottom" 
//             align="center" 
//             iconType="square" 
//             wrapperStyle={{ paddingTop: '20px' }}
//             formatter={(value) => <span className="text-primary-text text-sm">{value}</span>}
//           />
//           <Bar 
//             name="Units Sold"
//             dataKey="units" 
//             fill="var(--mintgreen)" 
//             radius={[6, 6, 0, 0]} 
//             barSize={60}
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default TopSellingChart;


"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "@/lib/api";

const staticData = [
  { name: "Paracetamol", units: 1250 },
  { name: "Ibuprofen",   units: 980  },
  { name: "Amoxicillin", units: 750  },
  { name: "Metformin",   units: 620  },
  { name: "Vitamin D3",  units: 580  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-secondary text-primary-text p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold">{label}</p>
        <p className="text-mintgreen">
          Units Sold: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const TopSellingChart = () => {
  const [chartData, setChartData]   = useState(staticData);
  const [isRealData, setIsRealData] = useState(false);

  useEffect(() => {
    const fetchTopSelling = async () => {
      try {
        const response = await api.get("/BusinessPerformance");
        const data     = response.data;

        if (data.topSellingMedicines && data.topSellingMedicines.length > 0) {
          const mapped = data.topSellingMedicines.map((item: any) => ({
            name:  item.medicine_Name     ?? item.medicineName ?? "Unknown",
            units: item.totalQuantitySold ?? item.quantity     ?? 0,
          }));

          const hasRealValues = mapped.some((item: any) => item.units > 0);
          if (hasRealValues) {
            setChartData(mapped);
            setIsRealData(true);
          }
          // if all zeros → keeps staticData as fallback
        }
      } catch (err) {
        console.error("Failed to fetch top selling:", err);
      }
    };

    fetchTopSelling();
  }, []);

  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-sm h-[400px] w-full">
      <div className="flex items-center justify-between mb-4 ps-3">
        <h2 className="font-bold text-primary-text">Top-Selling Medicines</h2>
        {!isRealData && (
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 text-muted-text">
            Sample Data
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 40 }}>
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
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--background)" }}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="square"
            wrapperStyle={{ paddingTop: "20px" }}
            formatter={(value) => (
              <span className="text-primary-text text-sm">{value}</span>
            )}
          />
          <Bar
            name="Units Sold"
            dataKey="units"
            fill="var(--mintgreen)"
            radius={[6, 6, 0, 0]}
            barSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopSellingChart;