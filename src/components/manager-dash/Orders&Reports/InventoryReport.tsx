// "use client";
// import React, { useState } from 'react';
// import { Package, Download, Layers } from 'lucide-react';

// interface InventoryReportProps {
//   onGenerate?: (data: { category: string; format: string }) => void;
// }

// const InventoryReport: React.FC<InventoryReportProps> = ({ onGenerate }) => {
//   const [category, setCategory] = useState('All Categories');
//   const [format, setFormat] = useState('Excel');

//   const handleGenerate = () => {
//     if (onGenerate) {
//       onGenerate({ category, format });
//     } else {
//       console.log('Generate Inventory Report:', { category, format });
//       alert(`Generating ${format} inventory report for ${category}`);
//     }
//   };

//   return (
//     <div className="bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
//       <div className="p-6">
//         {/* Header */}
//         <div className="flex items-start gap-3 mb-5">
//           <div className="p-2 bg-mintgreen/10 rounded-lg shrink-0">
//             <Package className="w-5 h-5 text-mintgreen" />
//           </div>
//           <div>
//             <h3 className="text-lg font-semibold text-primary-text">Inventory Report</h3>
//             <p className="text-sm text-muted-text">Export current inventory status and stock levels</p>
//           </div>
//         </div>

//         {/* Form Fields */}
//         <div className="space-y-4">
//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium text-primary-text mb-1.5">
//               Category
//             </label>
//             <div className="relative">
//               <Layers className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-text" />
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm appearance-none cursor-pointer"
//               >
//                 <option value="All Categories">All Categories</option>
//                 <option value="Pain Relief">Pain Relief</option>
//                 <option value="Antibiotics">Antibiotics</option>
//                 <option value="Vitamins">Vitamins</option>
//                 <option value="Diabetes">Diabetes</option>
//                 <option value="Cardiovascular">Cardiovascular</option>
//               </select>
//             </div>
//           </div>

//           {/* Format */}
//           <div>
//             <label className="block text-sm font-medium text-primary-text mb-1.5">
//               Format
//             </label>
//             <div className="relative">
//               <Download className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-text" />
//               <select
//                 value={format}
//                 onChange={(e) => setFormat(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen focus:ring-1 focus:ring-mintgreen transition-all text-sm appearance-none cursor-pointer"
//               >
//                 <option value="Excel">Excel</option>
//                 <option value="PDF">PDF</option>
//                 <option value="CSV">CSV</option>
//               </select>
//             </div>
//           </div>

//           {/* Generate Button */}
//           <button
//             onClick={handleGenerate}
//             className="w-full mt-2 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 transition-colors font-medium text-sm flex items-center justify-center gap-2"
//           >
//             <Download className="w-4 h-4" />
//             Generate Inventory Report
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventoryReport;

"use client";
import React, { useState, useEffect } from "react";
import { Package, Download, Layers } from "lucide-react";
import api from "@/lib/api";

interface InventoryReportProps {
  onGenerate?: (data: { category: string; format: string }) => void;
}

const InventoryReport: React.FC<InventoryReportProps> = ({ onGenerate }) => {
  const [category, setCategory] = useState("All Categories");
  const [format, setFormat]     = useState("Excel");
  const [loading, setLoading]   = useState(false);
  const [medicines, setMedicines] = useState<any[]>([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get("/Medicines");
        setMedicines(response.data);
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
      }
    };
    fetchMedicines();
  }, []);

  const getStatus = (qty: number) => {
    if (qty === 0)  return "Out of Stock";
    if (qty <= 20)  return "Low Stock";
    return "In Stock";
  };

  const getFilteredMedicines = () => {
    if (category === "All Categories") return medicines;
    return medicines.filter((m: any) =>
      m.batch_No?.toLowerCase().includes(category.toLowerCase())
    );
  };

  const handleGenerate = async () => {
    if (onGenerate) { onGenerate({ category, format }); return; }

    setLoading(true);
    try {
      const filtered = getFilteredMedicines();

      if (filtered.length === 0) {
        alert("No medicines found.");
        return;
      }

      const headers = ["ID", "Medicine Name", "Batch No", "Selling Price (EGP)", "Cost Price (EGP)", "Stock", "Expiry Date", "Status"];
      const rows    = filtered.map((m: any) => [
        m.medicine_ID,
        m.medicine_Name,
        m.batch_No       ?? "N/A",
        m.selling_Price  ?? 0,
        m.cost_Price     ?? 0,
        m.quantity_In_Stock ?? 0,
        m.expiry_Date && !m.expiry_Date.startsWith("0001")
          ? new Date(m.expiry_Date).toLocaleDateString("en-GB")
          : "N/A",
        getStatus(m.quantity_In_Stock ?? 0),
      ]);

      const summary = [
        [],
        ["Summary"],
        ["Total Medicines",   filtered.length],
        ["In Stock",          filtered.filter((m: any) => m.quantity_In_Stock > 20).length],
        ["Low Stock",         filtered.filter((m: any) => m.quantity_In_Stock > 0 && m.quantity_In_Stock <= 20).length],
        ["Out of Stock",      filtered.filter((m: any) => m.quantity_In_Stock === 0).length],
        ["Generated",         new Date().toLocaleDateString("en-GB")],
      ];

      if (format === "CSV") {
        const csv  = [...[headers], ...rows, ...summary].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href  = URL.createObjectURL(blob);
        link.setAttribute("download", `inventory_report_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } else if (format === "Excel") {
        const xls  = [...[headers], ...rows, ...summary].map((r) => r.join("\t")).join("\n");
        const blob = new Blob([xls], { type: "application/vnd.ms-excel" });
        const link = document.createElement("a");
        link.href  = URL.createObjectURL(blob);
        link.setAttribute("download", `inventory_report_${new Date().toISOString().split("T")[0]}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } else if (format === "PDF") {
        const printContent = `
          <html>
            <head>
              <title>Inventory Report</title>
              <style>
                body  { font-family: Arial, sans-serif; padding: 20px; }
                h1    { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th    { background: #f0f0f0; padding: 8px; text-align: left; border: 1px solid #ddd; font-size: 12px; }
                td    { padding: 8px; border: 1px solid #ddd; font-size: 12px; }
                .in-stock  { color: green; }
                .low-stock { color: orange; }
                .out       { color: red; }
                .summary   { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
              </style>
            </head>
            <body>
              <h1>Inventory Report</h1>
              <p>Category: ${category} | Generated: ${new Date().toLocaleDateString("en-GB")}</p>
              <table>
                <thead>
                  <tr>
                    ${headers.map((h) => `<th>${h}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${filtered.map((m: any) => {
                    const status = getStatus(m.quantity_In_Stock ?? 0);
                    const cls    = status === "In Stock" ? "in-stock" : status === "Low Stock" ? "low-stock" : "out";
                    return `
                      <tr>
                        <td>${m.medicine_ID}</td>
                        <td>${m.medicine_Name}</td>
                        <td>${m.batch_No ?? "N/A"}</td>
                        <td>${m.selling_Price ?? 0}</td>
                        <td>${m.cost_Price ?? 0}</td>
                        <td>${m.quantity_In_Stock ?? 0}</td>
                        <td>${m.expiry_Date && !m.expiry_Date.startsWith("0001") ? new Date(m.expiry_Date).toLocaleDateString("en-GB") : "N/A"}</td>
                        <td class="${cls}">${status}</td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
              <div class="summary">
                <strong>Total:</strong> ${filtered.length} medicines<br/>
                <strong>In Stock:</strong> ${filtered.filter((m: any) => m.quantity_In_Stock > 20).length} &nbsp;
                <strong>Low Stock:</strong> ${filtered.filter((m: any) => m.quantity_In_Stock > 0 && m.quantity_In_Stock <= 20).length} &nbsp;
                <strong>Out of Stock:</strong> ${filtered.filter((m: any) => m.quantity_In_Stock === 0).length}
              </div>
            </body>
          </html>
        `;
        const win = window.open("", "_blank");
        if (win) {
          win.document.write(printContent);
          win.document.close();
          win.print();
        }
      }
    } catch (err) {
      console.error("Failed to generate report:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCount = getFilteredMedicines().length;

  return (
    <div className="bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-mintgreen/10 rounded-lg shrink-0">
              <Package className="w-5 h-5 text-mintgreen" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-text">Inventory Report</h3>
              <p className="text-sm text-muted-text">Export current inventory status and stock levels</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-mintgreen/10 text-mintgreen rounded-full">
            {filteredCount} items
          </span>
        </div>

        <div className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Category</label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen text-sm appearance-none cursor-pointer"
              >
                <option value="All Categories">All Categories</option>
                <option value="In Stock">In Stock Only</option>
                <option value="Low Stock">Low Stock Only</option>
                <option value="Out of Stock">Out of Stock Only</option>
              </select>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Format</label>
            <div className="relative">
              <Download className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <select
                value={format} onChange={(e) => setFormat(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen text-sm appearance-none cursor-pointer"
              >
                <option value="Excel">Excel</option>
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || filteredCount === 0}
            className="w-full mt-2 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {loading ? "Generating..." : `Generate ${format} Report`}
          </button>

          {filteredCount === 0 && (
            <p className="text-xs text-muted-text text-center">No medicines found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryReport;