"use client";
import { useState, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import api from "@/lib/api";

interface ExpiringItem {
  name: string;
  expiryDate: string;
  daysLeft: string;
}

const staticData: ExpiringItem[] = [
  { name: "Cetirizine 10mg", expiryDate: "2026-04-30", daysLeft: "9 days" },
];

const getDaysLeft = (expiryDate: string): string => {
  const diff = Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return "Expired";
  if (diff === 0) return "Today";
  return `${diff} days`;
};

const getDaysColor = (daysLeft: string): string => {
  if (daysLeft === "Expired") return "text-darkred border-darkred/50";
  if (daysLeft === "Today") return "text-darkred border-darkred/50";
  if (daysLeft === "Check stock") return "text-muted-text border-gray-300";
  const days = parseInt(daysLeft);
  if (days <= 7) return "text-darkred border-darkred/50";
  if (days <= 30) return "text-darkyellow border-darkyellow/50";
  return "text-softgreen border-softgreen/50";
};

const ExpiringMedicines = () => {
  const [data, setData] = useState<ExpiringItem[]>(staticData);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchExpiring = async () => {
      try {
        const response = await api.get("/InventoryAlerts/status");
        const alerts = response.data;

        // use nearExpiry if available, otherwise fall back to lowStock
        const source =
          alerts.nearExpiry?.length > 0
            ? alerts.nearExpiry
            : (alerts.lowStock ?? []);

        if (source.length > 0) {
          const mapped: ExpiringItem[] = source.map((item: any) => ({
            name: item.medicine_Name,
            expiryDate:
              item.expiry_Date && !item.expiry_Date.startsWith("0001")
                ? new Date(item.expiry_Date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "No expiry set",
            daysLeft:
              item.expiry_Date && !item.expiry_Date.startsWith("0001")
                ? getDaysLeft(item.expiry_Date)
                : "Check stock",
          }));

          if (mapped.length > 0) setData(mapped);

          if (mapped.length > 0) setData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch expiring medicines:", err);
      }
    };

    fetchExpiring();
  }, []);

  const ExpiryCard = ({ med }: { med: ExpiringItem }) => (
    <div className="bg-softyellow/10 p-4 rounded-2xl flex justify-between items-center border border-softyellow/20">
      <div>
        <h3 className="font-bold text-primary-text text-sm">{med.name}</h3>
        <p className="text-xs text-muted-text mt-1">
          Expires: {med.expiryDate}
        </p>
      </div>
      <span
        className={`px-3 py-1 rounded-full border text-[10px] font-bold bg-secondary ${getDaysColor(med.daysLeft)}`}
      >
        {med.daysLeft}
      </span>
    </div>
  );

  return (
    <>
      {/* Main Card */}
      <div className="bg-secondary p-6 rounded-2xl shadow-sm h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="text-darkyellow" size={20} />
            <h2 className="font-bold text-primary-text">Expiring Medicines</h2>
          </div>
          {data.length > 4 && (
            <button
              onClick={() => setShowModal(true)}
              className="text-xs font-bold text-muted-text hover:text-mintgreen transition-colors"
            >
              See All &gt;
            </button>
          )}
        </div>

        <div className="space-y-3">
          {data.slice(0, 4).map((med, index) => (
            <ExpiryCard key={index} med={med} />
          ))}
        </div>

        {data.length > 4 && (
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 py-2 text-xs font-bold text-muted-text hover:text-mintgreen transition-colors text-center"
          >
            +{data.length - 4} more · See All
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
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-primary-text">
                  Expiring Medicines
                </h2>
                <p className="text-xs text-muted-text mt-1">
                  {data.length} medicines expiring soon
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-background rounded-full"
              >
                <X size={20} className="text-muted-text" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-3">
              {data.map((med, index) => (
                <ExpiryCard key={index} med={med} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpiringMedicines;
