"use client";
import React, { useState, useEffect } from "react";
import { Search, Eye, Calendar, Filter, Download, X, User, Package, CreditCard } from "lucide-react";
import api from "@/lib/api";

interface Order {
  id:          number;
  orderNumber: string;
  customer:    string;
  date:        string;
  items:       number;
  total:       number;
  status:      string;
  paymentMethod: string;
  itemsList:   { name: string; quantity: number; price: number }[];
}

const SalesOrders: React.FC = () => {
  const [searchTerm, setSearchTerm]   = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [orders, setOrders]           = useState<Order[]>([]);
  const [loading, setLoading]         = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===== FETCH =====
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/Orders");
        const data     = response.data;

        const mapped: Order[] = data.map((item: any) => ({
          id:          item.orderId,
          orderNumber: `ORD-${item.orderId}`,
          customer:    item.clientName    ?? "Unknown",
          date:        item.orderDate
            ? new Date(item.orderDate).toLocaleDateString("en-CA") // YYYY-MM-DD for filtering
            : "N/A",
          items:       item.items?.length ?? 0,
          total:       item.totalAmount   ?? 0,
          status:      "Completed",       // backend doesn't return status
          paymentMethod: item.paymentMethod ?? "Cash",
          itemsList:   (item.items ?? []).map((i: any) => ({
            name:     i.medicine_Name ?? i.medicineName ?? `Medicine #${i.medicine_ID}`,
            quantity: i.quantity      ?? 1,
            price:    i.unitPrice     ?? i.price ?? 0,
          })),
        }));

        setOrders(mapped);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ===== HELPERS =====
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-softgreen text-primary-text";
      case "Pending":   return "bg-softyellow text-primary-text";
      case "Cancelled": return "bg-softred text-primary-text";
      default:          return "bg-secondary text-muted-text";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch  = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus  = statusFilter === "All" || order.status === statusFilter;
    let   matchesDate    = true;
    if (startDate && order.date < startDate) matchesDate = false;
    if (endDate   && order.date > endDate)   matchesDate = false;
    return matchesSearch && matchesStatus && matchesDate;
  });

  // ===== EXPORT =====
  const handleExport = () => {
    const headers = ["Order Number", "Customer", "Date", "Items", "Total (EGP)", "Payment"];
    const rows    = filteredOrders.map((o) => [
      o.orderNumber, o.customer, o.date,
      o.items.toString(), o.total.toFixed(2), o.paymentMethod,
    ]);
    const csv  = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href  = URL.createObjectURL(blob);
    link.setAttribute("download", `orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 bg-secondary mt-2 rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-text mb-1">Sales Orders</h1>
          <p className="text-muted-text text-sm">Track and manage customer orders</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 transition-colors font-medium text-sm"
        >
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
          <input
            type="text" placeholder="Search orders..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg focus:outline-none focus:border-mintgreen text-sm"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
          <select
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg focus:outline-none appearance-none cursor-pointer text-sm"
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg focus:outline-none text-sm"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background text-primary-text rounded-lg focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Order Number</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Customer</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Date</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Items</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Total</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Payment</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-background transition-colors">
                  <td className="p-4 text-sm font-medium text-primary-text">{order.orderNumber}</td>
                  <td className="p-4 text-sm text-muted-text">{order.customer}</td>
                  <td className="p-4 text-sm text-muted-text">{order.date}</td>
                  <td className="p-4 text-sm text-muted-text">{order.items}</td>
                  <td className="p-4 text-sm text-primary-text">EGP {order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-mintgreen bg-mintgreen/10 rounded-lg hover:bg-mintgreen/20 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-text">No orders found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700">

            <div className="sticky top-0 bg-secondary border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-text">Order Details</h2>
              <button onClick={() => { setIsModalOpen(false); setSelectedOrder(null); }}
                className="p-1 text-muted-text hover:text-primary-text rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-text">Order Number</p>
                  <p className="text-sm font-semibold text-primary-text">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-text">Date</p>
                  <p className="text-sm font-semibold text-primary-text">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-text">Payment</p>
                  <p className="text-sm font-semibold text-primary-text">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-text">Total</p>
                  <p className="text-sm font-semibold text-primary-text">EGP {selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              {/* Customer */}
              <div>
                <h3 className="text-sm font-semibold text-primary-text mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-mintgreen" /> Customer Information
                </h3>
                <div className="pl-6">
                  <p className="text-xs text-muted-text">Name</p>
                  <p className="text-sm text-primary-text">{selectedOrder.customer}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold text-primary-text mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-mintgreen" /> Items ({selectedOrder.items} products)
                </h3>
                <div className="overflow-x-auto pl-6">
                  {selectedOrder.itemsList.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200 dark:border-gray-700">
                        <tr>
                          <th className="text-left py-2 text-xs text-muted-text font-medium">Product</th>
                          <th className="text-left py-2 text-xs text-muted-text font-medium">Quantity</th>
                          <th className="text-left py-2 text-xs text-muted-text font-medium">Price</th>
                          <th className="text-left py-2 text-xs text-muted-text font-medium">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.itemsList.map((item, idx) => (
                          <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                            <td className="py-2 text-primary-text">{item.name}</td>
                            <td className="py-2 text-muted-text">{item.quantity}</td>
                            <td className="py-2 text-muted-text">EGP {item.price.toFixed(2)}</td>
                            <td className="py-2 text-primary-text">EGP {(item.quantity * item.price).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t border-gray-200 dark:border-gray-700">
                          <td colSpan={3} className="py-2 text-right font-semibold text-primary-text">Total:</td>
                          <td className="py-2 font-bold text-primary-text">EGP {selectedOrder.total.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <p className="text-sm text-muted-text">No item details available</p>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-secondary border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
              <button
                onClick={() => { setIsModalOpen(false); setSelectedOrder(null); }}
                className="px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;