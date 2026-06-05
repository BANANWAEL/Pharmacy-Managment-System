"use client";
import { useState, useEffect } from "react";
import { RefreshCcw, TrendingUp, CheckCircle2, X } from "lucide-react";
import api from "@/lib/api";

const staticMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    subtitle: "Acetaminophen",
    expireDate: "24 Dec 2026",
    stock: 40,
  },
  {
    id: 2,
    name: "Paracetamol 500mg",
    subtitle: "Acetaminophen",
    expireDate: "24 Dec 2026",
    stock: 40,
  },
  {
    id: 3,
    name: "Paracetamol 500mg",
    subtitle: "Acetaminophen",
    expireDate: "24 Dec 2026",
    stock: 40,
  },
  {
    id: 4,
    name: "Paracetamol 500mg",
    subtitle: "Acetaminophen",
    expireDate: "24 Dec 2026",
    stock: 40,
  },
];

const InStock = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicines, setMedicines] = useState(staticMedicines);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get("/Medicines");
        const data = response.data;
        console.log("Medicines:", data);
        console.log("First medicine:", data[0]); // 🔍 check keys

        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            id: item.medicine_ID,
            name: item.medicine_Name,
            subtitle: `${item.quantity_In_Stock} stock - ${item.selling_Price} EGP`,
            expireDate:
              item.expiry_Date && !item.expiry_Date.startsWith("0001")
                ? new Date(item.expiry_Date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "Not set",
            stock: item.quantity_In_Stock,
          }));
          setMedicines(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
        // keeps staticMedicines as fallback
      }
    };

    fetchMedicines();
  }, []);

  const TableRows = ({ data }: { data: typeof medicines }) => (
    <>
      {data.map((med) => (
        <tr
          key={med.id}
          className="group hover:bg-gray-50/50 transition-colors"
        >
          <td className="py-2.5">
            <p className="text-xs font-black text-primary-text leading-tight">
              {med.name}
            </p>
            <p className="text-[9px] text-muted-text font-medium">
              {med.subtitle}
            </p>
          </td>
          <td className="py-2.5 text-[11px] font-medium text-primary-text">
            {med.expireDate}
          </td>
          <td className="py-2.5 text-[11px] font-black text-primary-text">
            {med.stock}
          </td>
          <td className="py-2.5">
            <TrendingUp size={14} className="text-softgreen opacity-70" />
          </td>
          <td className="py-2.5 text-right pr-2">
            <button className="p-1.5 bg-gray-50 dark:bg-background rounded-lg text-muted-text hover:text-darkred">
              <RefreshCcw size={12} />
            </button>
          </td>
        </tr>
      ))}
    </>
  );

  const TableHead = () => (
    <thead>
      <tr className="text-muted-text text-[10px] font-medium uppercase tracking-wider border-b border-gray-50 dark:border-gray-800">
        <th className="pb-2 font-medium">Medicine name</th>
        <th className="pb-2 font-medium">Expire Date</th>
        <th className="pb-2 font-medium text-mintgreen">Stock</th>
        <th className="pb-2 font-medium">Chart</th>
        <th className="pb-2 font-medium text-right pr-2">Return</th>
      </tr>
    </thead>
  );

  return (
    <>
      {/* Dashboard Table */}
      <div className="bg-white dark:bg-secondary rounded-[40px] my-2 p-6 shadow-sm w-full">
        <div className="flex justify-between items-center mb-4 px-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-mintgreen" size={20} />
            <h2 className="text-lg font-bold text-primary-text">In Stock</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[10px] font-black text-mintgreen hover:underline uppercase tracking-tighter"
          >
            See All {">"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <TableHead />
            <tbody>
              <TableRows data={medicines.slice(0, 3)} />
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-80 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-secondary w-full max-w-4xl max-h-[85vh] rounded-[40px] shadow-2xl animate-in zoom-in-95 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-primary-text">
                  Full Inventory List
                </h2>
                <p className="text-xs text-muted-text mt-1">
                  {medicines.length} medicines in stock
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} className="text-muted-text" />
              </button>
            </div>

            <div className="overflow-y-auto">
              <table className="w-full text-left">
                <TableHead />
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  <TableRows data={medicines} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InStock;
