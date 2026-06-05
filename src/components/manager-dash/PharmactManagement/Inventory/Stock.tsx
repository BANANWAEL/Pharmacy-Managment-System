import { AlertTriangle } from "lucide-react";

interface Item {
  name:   string;
  count?: number;
  status: "low" | "out";
}

interface InventoryAlertsProps {
  title:   string;
  items:   Item[];
  type:    "low" | "out";
  loading?: boolean;
}

export default function InventoryAlerts({ title, items, type, loading }: InventoryAlertsProps) {
  return (
    <div className="rounded-2xl p-6 bg-secondary">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className={type === "low" ? "text-yellow-500" : "text-red-500"} size={20} />
        <h2 className="font-bold text-lg text-primary-text">{title}</h2>
        <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${
          type === "low" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
        }`}>
          {items.length}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-6 text-center text-muted-text text-sm">
          {type === "low" ? "✅ All stock levels are healthy" : "✅ No out of stock items"}
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2 rounded-xl flex items-center justify-between ${
                type === "low" ? "bg-yellow-100 dark:bg-yellow-900/10" : "bg-red-50 dark:bg-red-900/10"
              }`}
            >
              <div>
                <h3 className="font-bold text-primary-text">{item.name}</h3>
                {item.count !== undefined && (
                  <p className="text-sm text-muted-text">Current: {item.count} units</p>
                )}
                {type === "out" && (
                  <p className="text-xs text-red-500 mt-1">Immediate action required</p>
                )}
              </div>
              <button className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                type === "low"
                  ? "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}>
                {type === "low" ? "Reorder" : "Order Now"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}