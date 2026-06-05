"use client";
import { useState, useEffect } from "react";
import { PackageX, AlertTriangle, X } from "lucide-react";
import api from "@/lib/api";

const staticItems = [
  { id: 1, name: "Panadol Advance", category: "Analgesic",         lastPrice: "35 EGP",  availabledate: "22/3/2026" },
  { id: 2, name: "Augmentin 1g",    category: "Antibiotic",        lastPrice: "120 EGP", availabledate: "19/3/2026" },
  { id: 3, name: "Brufen 400mg",    category: "Anti-inflammatory", lastPrice: "45 EGP",  availabledate: "13/3/2026" },
  { id: 4, name: "Concor 5mg",      category: "Heart Disease",     lastPrice: "60 EGP",  availabledate: "29/3/2026" },
];

const OutOfStock = () => {
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState(staticItems);

  useEffect(() => {
    const fetchOutOfStock = async () => {
      try {
        const response = await api.get("/InventoryAlerts/status");
        const data = response.data;

        if (data.outOfStock && data.outOfStock.length > 0) {
          const mapped = data.outOfStock.map((item: any) => ({
            id:            item.medicine_ID,
            name:          item.medicine_Name,
            category:      item.batch_No ?? "N/A",
            lastPrice:     `${item.selling_Price ?? 0} EGP`,
            availabledate: item.expiry_Date && !item.expiry_Date.startsWith("0001")
              ? new Date(item.expiry_Date).toLocaleDateString("en-GB")
              : "Not set",
          }));
          setOutOfStockItems(mapped);
        }
        // if empty → keeps staticItems as fallback
      } catch (err) {
        console.error("Failed to fetch out of stock:", err);
        // keeps staticItems as fallback
      }
    };

    fetchOutOfStock();
  }, []);

  return (
    <>
      {/* Dashboard Card */}
      <div className="bg-white dark:bg-secondary rounded-[40px] p-6 shadow-sm h-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PackageX className="text-darkred" size={24} />
            <h2 className="text-sm font-black text-primary-text tracking-tight">Out of Stock</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-bold text-mintgreen hover:underline"
          >
            View All
          </button>
        </div>

        <div>
          {outOfStockItems.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between my-1 p-2 bg-background dark:bg-background/40 rounded-2xl"
            >
              <div>
                <p className="text-sm font-bold text-primary-text">{item.name}</p>
                <p className="text-[10px] text-muted-text uppercase font-medium">{item.category}</p>
              </div>
              <div className="bg-darkred/10 px-3 py-1 rounded-full">
                <span className="text-darkred text-[10px] font-black">OUT</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-secondary w-full max-w-2xl rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-darkred/10 p-2 rounded-xl">
                    <AlertTriangle className="text-darkred" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-primary-text">Shortage List</h2>
                    <p className="text-xs text-muted-text">{outOfStockItems.length} items out of stock</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-background rounded-full"
                >
                  <X size={20} className="text-muted-text" />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-2">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-muted-text text-[10px] font-black uppercase tracking-widest">
                      <th className="pb-2 pl-4">Product</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Last Price</th>
                      <th className="pb-2 text-right pr-4">Available on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outOfStockItems.map((item) => (
                      <tr
                        key={item.id}
                        className="bg-background dark:bg-background/30 rounded-2xl overflow-hidden"
                      >
                        <td className="py-4 pl-4 rounded-l-2xl text-sm font-bold text-primary-text">{item.name}</td>
                        <td className="py-4 text-xs text-muted-text">{item.category}</td>
                        <td className="py-4 text-sm font-bold text-mintgreen">{item.lastPrice}</td>
                        <td className="py-4 text-xs text-muted-text text-center">{item.availabledate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OutOfStock;