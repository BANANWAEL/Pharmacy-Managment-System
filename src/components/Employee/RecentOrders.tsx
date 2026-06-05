"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

const staticOrders = [
  {
    name: "Paricel 15mg",
    batch: "783627",
    qty: 40,
    status: "Delivered",
    price: "$23.00",
    color: "text-darkblue bg-softblue/20",
  },
  {
    name: "Abetis 20mg",
    batch: "88832",
    qty: 40,
    status: "Pending",
    price: "$23.00",
    color: "text-darkyellow bg-softyellow/20",
  },
  {
    name: "Cerox CV",
    batch: "767676",
    qty: 40,
    status: "Cancelled",
    price: "$23.00",
    color: "text-darkred bg-softred/20",
  },
  {
    name: "Abetis 20mg",
    batch: "45578",
    qty: 40,
    status: "Delivered",
    price: "$23.00",
    color: "text-darkblue bg-softblue/20",
  },
  {
    name: "Cerox CV",
    batch: "767676",
    qty: 40,
    status: "Cancelled",
    price: "$23.00",
    color: "text-darkred bg-softred/20",
  },
  {
    name: "Panadol Extra",
    batch: "112233",
    qty: 20,
    status: "Pending",
    price: "$10.00",
    color: "text-darkyellow bg-softyellow/20",
  },
];

const getStatusColor = (method: string) => {
  switch (method?.toLowerCase()) {
    case "cash":
      return "text-darkblue bg-softblue/20";
    case "card":
      return "text-darkyellow bg-softyellow/20";
    case "online":
      return "text-darkred bg-softred/20";
    default:
      return "text-darkblue bg-softblue/20";
  }
};

export default function RecentOrders() {
  const [showModal, setShowModal] = useState(false);
  const [allOrders, setAllOrders] = useState(staticOrders);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/Orders");
        const data = response.data;

        if (data && data.length > 0) {
          const mapped = data.map((item: any) => ({
            name: item.clientName,
            batch: item.orderId,
            qty: item.items?.[0]?.quantity ?? 1,
            status: item.paymentMethod ?? "Cash",
            price: `${item.totalAmount} EGP`,
            color: getStatusColor(item.paymentMethod),
          }));
          setAllOrders(mapped); // ✅ this line was missing
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const limitedOrders = allOrders.slice(0, 4);

  return (
    <>
      <div className="bg-secondary p-6 rounded-4xl shadow-sm flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-primary-text">
            Recent Order's
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-bold text-muted-text hover:text-mintgreen dark:hover:text-softgreen transition-colors"
          >
            See All &gt;
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-muted-text text-xs border-b border-gray-100 dark:border-gray-800">
              <th className="pb-2 font-medium">Client Name</th>
              <th className="pb-2 font-medium">Order ID</th>
              <th className="pb-2 font-medium">Quantity</th>
              <th className="pb-2 font-medium">Payment</th>
              <th className="pb-2 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {limitedOrders.map((order, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <td className="py-2 font-semibold text-primary-text">
                  {order.name}
                </td>
                <td className="py-2 text-muted-text">{order.batch}</td>
                <td className="py-2 text-muted-text">{order.qty}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.color}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 font-bold text-primary-text">
                  {order.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-background dark:bg-secondary w-full max-w-3xl max-h-[85vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-800">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white/50 dark:bg-black/20">
              <div>
                <h2 className="font-bold text-2xl text-primary-text">
                  All Recent Orders
                </h2>
                <p className="text-xs text-muted-text mt-1">
                  Detailed history of all pharmacy transactions
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-darkred/10 hover:text-darkred rounded-2xl transition-all text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted-text text-xs border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-2 font-medium">Client Name</th>
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Quantity</th>
                    <th className="pb-2 font-medium">Payment</th>
                    <th className="pb-2 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {allOrders.map((order, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-black/10 transition-colors"
                    >
                      <td className="py-5 font-semibold text-primary-text">
                        {order.name}
                      </td>
                      <td className="py-5 text-muted-text">{order.batch}</td>
                      <td className="py-5 text-muted-text">{order.qty}</td>
                      <td className="py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${order.color}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5 font-bold text-primary-text">
                        {order.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
