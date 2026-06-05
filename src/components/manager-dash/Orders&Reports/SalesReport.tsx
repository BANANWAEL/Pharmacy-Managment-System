"use client";
import React, { useState, useEffect } from "react";
import { FileText, Calendar, Download } from "lucide-react";
import api from "@/lib/api";

interface SalesReportProps {
  onGenerate?: (data: { period: string; format: string }) => void;
}

const SalesReport: React.FC<SalesReportProps> = ({ onGenerate }) => {
  const [period, setPeriod]   = useState("Monthly");
  const [format, setFormat]   = useState("CSV");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders]   = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/Orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // filter orders by selected period
  const getFilteredOrders = () => {
    const now  = new Date();
    return orders.filter((order: any) => {
      const orderDate = new Date(order.orderDate);
      switch (period) {
        case "Daily":
          return orderDate.toDateString() === now.toDateString();
        case "Weekly": {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return orderDate >= weekAgo;
        }
        case "Monthly":
          return orderDate.getMonth() === now.getMonth() &&
                 orderDate.getFullYear() === now.getFullYear();
        case "Quarterly": {
          const quarterAgo = new Date();
          quarterAgo.setMonth(now.getMonth() - 3);
          return orderDate >= quarterAgo;
        }
        case "Yearly":
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  };

  const handleGenerate = async () => {
    if (onGenerate) { onGenerate({ period, format }); return; }

    setLoading(true);
    try {
      const filtered = getFilteredOrders();

      if (filtered.length === 0) {
        alert(`No orders found for ${period} period.`);
        return;
      }

      const totalSales  = filtered.reduce((sum: number, o: any) => sum + (o.totalAmount ?? 0), 0);
      const totalOrders = filtered.length;

      if (format === "CSV") {
        // ===== CSV Export =====
        const headers = ["Order ID", "Client", "Employee", "Date", "Payment", "Total (EGP)"];
        const rows    = filtered.map((o: any) => [
          o.orderId,
          o.clientName   ?? "N/A",
          o.employeeName ?? "N/A",
          new Date(o.orderDate).toLocaleDateString("en-GB"),
          o.paymentMethod ?? "Cash",
          o.totalAmount   ?? 0,
        ]);
        const summary = [
          [],
          ["Summary"],
          ["Total Orders", totalOrders],
          ["Total Sales (EGP)", totalSales.toFixed(2)],
          ["Period", period],
          ["Generated", new Date().toLocaleDateString("en-GB")],
        ];

        const csv  = [...[headers], ...rows, ...summary]
          .map((r) => r.join(","))
          .join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href  = URL.createObjectURL(blob);
        link.setAttribute("download", `sales_report_${period.toLowerCase()}_${new Date().toISOString().split("T")[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } else if (format === "Excel") {
        // ===== Excel Export (tab-separated .xls) =====
        const headers = ["Order ID", "Client", "Employee", "Date", "Payment", "Total (EGP)"];
        const rows    = filtered.map((o: any) => [
          o.orderId,
          o.clientName   ?? "N/A",
          o.employeeName ?? "N/A",
          new Date(o.orderDate).toLocaleDateString("en-GB"),
          o.paymentMethod ?? "Cash",
          o.totalAmount   ?? 0,
        ]);
        const summary = [
          [],
          ["Summary"],
          ["Total Orders", totalOrders],
          ["Total Sales (EGP)", totalSales.toFixed(2)],
          ["Period", period],
          ["Generated", new Date().toLocaleDateString("en-GB")],
        ];

        const xls  = [...[headers], ...rows, ...summary]
          .map((r) => r.join("\t"))
          .join("\n");
        const blob = new Blob([xls], { type: "application/vnd.ms-excel" });
        const link = document.createElement("a");
        link.href  = URL.createObjectURL(blob);
        link.setAttribute("download", `sales_report_${period.toLowerCase()}_${new Date().toISOString().split("T")[0]}.xls`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } else if (format === "PDF") {
        // ===== PDF Export (print dialog) =====
        const printContent = `
          <html>
            <head>
              <title>Sales Report - ${period}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #f0f0f0; padding: 8px; text-align: left; border: 1px solid #ddd; }
                td { padding: 8px; border: 1px solid #ddd; }
                .summary { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 8px; }
              </style>
            </head>
            <body>
              <h1>Sales Report — ${period}</h1>
              <p>Generated: ${new Date().toLocaleDateString("en-GB")}</p>
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th><th>Client</th><th>Employee</th>
                    <th>Date</th><th>Payment</th><th>Total (EGP)</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.map((o: any) => `
                    <tr>
                      <td>${o.orderId}</td>
                      <td>${o.clientName ?? "N/A"}</td>
                      <td>${o.employeeName ?? "N/A"}</td>
                      <td>${new Date(o.orderDate).toLocaleDateString("en-GB")}</td>
                      <td>${o.paymentMethod ?? "Cash"}</td>
                      <td>${o.totalAmount ?? 0}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <div class="summary">
                <strong>Total Orders:</strong> ${totalOrders}<br/>
                <strong>Total Sales:</strong> EGP ${totalSales.toFixed(2)}
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

  const filteredCount = getFilteredOrders().length;

  return (
    <div className="bg-secondary rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-mintgreen/10 rounded-lg">
              <FileText className="w-5 h-5 text-mintgreen" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-text">Sales Report</h3>
              <p className="text-sm text-muted-text">Generate comprehensive sales reports</p>
            </div>
          </div>
          {/* Live count badge */}
          <span className="text-xs font-bold px-2 py-1 bg-mintgreen/10 text-mintgreen rounded-full">
            {filteredCount} orders
          </span>
        </div>

        <div className="space-y-4 mt-4">
          {/* Period */}
          <div>
            <label className="block text-sm font-medium text-primary-text mb-1.5">Report Period</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
              <select
                value={period} onChange={(e) => setPeriod(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen text-sm appearance-none cursor-pointer"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
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
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
                <option value="CSV">CSV</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || filteredCount === 0}
            className="w-full mt-2 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 transition-colors font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            {loading ? "Generating..." : `Generate ${format} Report`}
          </button>

          {filteredCount === 0 && (
            <p className="text-xs text-muted-text text-center">No orders found for {period} period</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;