"use client";
import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import api from "@/lib/api";

interface StockItem {
  name:   string;
  stock:  number;
  status: "Low Stock" | "Out of Stock";
}

const staticData: StockItem[] = [
  { name: "Amoxicillin 250mg", stock: 15, status: "Low Stock"    },
  { name: "Aspirin 100mg",     stock: 8,  status: "Low Stock"    },
  { name: "Omeprazole 20mg",   stock: 0,  status: "Out of Stock" },
  { name: "Cetirizine 10mg",   stock: 12, status: "Low Stock"    },
];

const CriticalStockWarnings = () => {
  const [data, setData]           = useState<StockItem[]>(staticData);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get("/InventoryAlerts/status");
        const alerts   = response.data;

        const outOfStock: StockItem[] = (alerts.outOfStock ?? []).map((item: any) => ({
          name:   item.medicine_Name,
          stock:  0,
          status: "Out of Stock" as const,
        }));

        const lowStock: StockItem[] = (alerts.lowStock ?? []).map((item: any) => ({
          name:   item.medicine_Name,
          stock:  item.quantity_In_Stock,
          status: "Low Stock" as const,
        }));

        const combined = [...outOfStock, ...lowStock];
        if (combined.length > 0) setData(combined);
      } catch (err) {
        console.error("Failed to fetch critical stock:", err);
      }
    };

    fetchAlerts();
  }, []);

  const StockCard = ({ med }: { med: StockItem }) => (
    <div className="bg-softred/10 p-4 rounded-2xl flex justify-between items-center border border-softred/20">
      <div>
        <h3 className="font-bold text-primary-text text-sm">{med.name}</h3>
        <p className="text-xs text-muted-text mt-1">Current Stock: {med.stock}</p>
      </div>
      {med.status === "Out of Stock" ? (
        <span className="px-3 py-1 rounded-lg bg-darkred text-inverse-text text-[10px] font-bold">
          Out of Stock
        </span>
      ) : (
        <span className="px-3 py-1 rounded-lg border border-darkyellow/50 text-darkyellow text-[10px] font-bold bg-secondary">
          Low Stock
        </span>
      )}
    </div>
  );

  return (
    <>
      {/* Main Card */}
      <div className="bg-secondary p-6 rounded-2xl shadow-sm h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-darkred" size={20} />
            <h2 className="font-bold text-primary-text">Critical Stock Warnings</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-darkred bg-darkred/10 px-2 py-1 rounded-full">
              {data.filter(d => d.status === "Out of Stock").length} Out · {data.filter(d => d.status === "Low Stock").length} Low
            </span>
            {data.length > 4 && (
              <button
                onClick={() => setShowModal(true)}
                className="text-xs font-bold text-muted-text hover:text-mintgreen transition-colors"
              >
                See All &gt;
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {data.slice(0, 4).map((med, index) => (
            <StockCard key={index} med={med} />
          ))}
        </div>

        {/* See All button at bottom if more than 4 */}
        {data.length > 4 && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 py-2 text-xs font-bold text-muted-text hover:text-mintgreen transition-colors text-center"
          >
            +{data.length - 4} more items · See All
          </button>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-background dark:bg-secondary w-full max-w-2xl max-h-[85vh] rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-primary-text">Critical Stock Warnings</h2>
                <p className="text-xs text-muted-text mt-1">
                  {data.filter(d => d.status === "Out of Stock").length} out of stock · {data.filter(d => d.status === "Low Stock").length} low stock
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-background rounded-full"
              >
                <X size={20} className="text-muted-text" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-3">
              {data.map((med, index) => (
                <StockCard key={index} med={med} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CriticalStockWarnings;