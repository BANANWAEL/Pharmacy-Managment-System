"use client";
import { useState, useEffect } from "react";
import InventoryAlerts from "@/components/manager-dash/PharmactManagement/Inventory/Stock"; // adjust path
import api from "@/lib/api";

export default function InventoryAlertsSection() {
  const [lowStock,  setLowStock]  = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await api.get("/InventoryAlerts/status");
        const data     = response.data;

        setLowStock(
          (data.lowStock ?? []).map((item: any) => ({
            name:  item.medicine_Name,
            count: item.quantity_In_Stock,
            status: "low" as const,
          }))
        );

        setOutOfStock(
          (data.outOfStock ?? []).map((item: any) => ({
            name:   item.medicine_Name,
            count:  0,
            status: "out" as const,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch inventory alerts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InventoryAlerts
        title="Low Stock"
        items={lowStock}
        type="low"
        loading={loading}
      />
      <InventoryAlerts
        title="Out of Stock"
        items={outOfStock}
        type="out"
        loading={loading}
      />
    </div>
  );
}