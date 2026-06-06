"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  Package,
  DollarSign,
  Calendar,
  ShoppingCart,
  User,
  Hash,
  Layers,
  Plus,
} from "lucide-react";
import api from "@/lib/api";

const Topbar = () => {
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Medicine form
  const [medLoading, setMedLoading] = useState(false);
  const [medSuccess, setMedSuccess] = useState(false);
  const [medError, setMedError] = useState("");
  const [medForm, setMedForm] = useState({
    medicine_Name: "",
    selling_Price: "",
    cost_Price: "",
    batch_No: "",
    quantity_In_Stock: "",
    expiry_Date: "",
  });

  // Order form
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [medicines, setMedicines] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({
    client_ID: "",
    medicine_ID: "",
    quantity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medRes, clientRes, profileRes] = await Promise.all([
          api.get("/Medicines"),
          api.get("/Clients"),
          api.get("/employees/me"),
        ]);
        setMedicines(medRes.data);
        setClients(clientRes.data);
        setProfile(profileRes.data);
        console.log("First client:", clientRes.data[0]); // 🔍 check keys
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleMedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMedForm({ ...medForm, [e.target.name]: e.target.value });
  };

  const closeMedicineModal = () => {
    setIsMedicineModalOpen(false);
    setMedSuccess(false);
    setMedError("");
    setMedForm({
      medicine_Name: "",
      selling_Price: "",
      cost_Price: "",
      batch_No: "",
      quantity_In_Stock: "",
      expiry_Date: "",
    });
  };

  const handleMedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMedLoading(true);
    setMedError("");
    try {
      await api.post("/Medicines", {
        medicine_Name: medForm.medicine_Name,
        selling_Price: parseFloat(medForm.selling_Price),
        cost_Price: parseFloat(medForm.cost_Price),
        batch_No: medForm.batch_No,
        quantity_In_Stock: parseInt(medForm.quantity_In_Stock),
        expiry_Date: new Date(medForm.expiry_Date).toISOString(),
      });
      setMedSuccess(true);
      setTimeout(() => closeMedicineModal(), 1500);
    } catch (err: any) {
      setMedError(err.message || "Failed to add medicine.");
    } finally {
      setMedLoading(false);
    }
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
    setOrderSuccess(false);
    setOrderError("");
    setOrderForm({ client_ID: "", medicine_ID: "", quantity: "" });
  };

  const handleOrderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setOrderForm({ ...orderForm, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    setOrderError("");

    // ✅ check quantity before sending
    const selectedMedicine = medicines.find(
      (m: any) => m.medicine_ID === parseInt(orderForm.medicine_ID),
    );

    if (
      selectedMedicine &&
      parseInt(orderForm.quantity) > selectedMedicine.quantity_In_Stock
    ) {
      setOrderError(
        `Not enough stock. Only ${selectedMedicine.quantity_In_Stock} units available for ${selectedMedicine.medicine_Name}.`,
      );
      setOrderLoading(false);
      return;
    }

    try {
      const payload = {
        client_ID: parseInt(orderForm.client_ID),
        employee_ID: profile?.employee_ID,
        orderDate: new Date().toISOString(),
        items: [
          {
            medicine_ID: parseInt(orderForm.medicine_ID),
            quantity: parseInt(orderForm.quantity),
          },
        ],
      };

      await api.post("/Orders", payload);
      setOrderSuccess(true);
      setTimeout(() => closeOrderModal(), 1500);
    } catch (err: any) {
      const errData = err.response?.data;
      const errMsg = errData?.errors
        ? Object.values(errData.errors).flat().join(", ")
        : (errData?.title ?? err.message ?? "Failed to create order.");
      setOrderError(errMsg);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="bg-background p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-text">Dashboard</h1>
          <p className="text-muted-text text-sm mt-1">
            Welcome back, {profile?.employee_Name ?? "..."}
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-primary-text bg-secondary hover:bg-background transition-colors"
          >
            <ShoppingCart size={18} /> Add Order
          </button>
          <button
            onClick={() => setIsMedicineModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg text-sm font-medium hover:opacity-90 transition-colors shadow-sm"
          >
            <Plus size={18} /> Add Medicine
          </button>
        </div>
      </div>

      {/* ===== Add Medicine Modal ===== */}
      {isMedicineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={closeMedicineModal}
          />
          <div className="relative bg-secondary w-full max-w-lg rounded-[40px] shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-primary-text tracking-tight">
                    Add New Product
                  </h2>
                  <p className="text-xs text-muted-text mt-1">
                    Fill in the product details to add to inventory
                  </p>
                </div>
                <button
                  onClick={closeMedicineModal}
                  className="p-2 hover:bg-background rounded-full transition-colors"
                >
                  <X size={20} className="text-muted-text" />
                </button>
              </div>

              {medSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-16 h-16 bg-mintgreen/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl text-mintgreen">✓</span>
                  </div>
                  <p className="text-lg font-black text-primary-text">
                    Product Added!
                  </p>
                  <p className="text-xs text-muted-text">
                    Closing automatically...
                  </p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleMedSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-text px-1 uppercase">
                      Product Name
                    </label>
                    <div className="relative">
                      <Package
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                        size={18}
                      />
                      <input
                        type="text"
                        name="medicine_Name"
                        value={medForm.medicine_Name}
                        onChange={handleMedChange}
                        placeholder="e.g. Panadol Extra"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">
                        Selling Price
                      </label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={18}
                        />
                        <input
                          type="number"
                          name="selling_Price"
                          value={medForm.selling_Price}
                          onChange={handleMedChange}
                          placeholder="0.00"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">
                        Cost Price
                      </label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={18}
                        />
                        <input
                          type="number"
                          name="cost_Price"
                          value={medForm.cost_Price}
                          onChange={handleMedChange}
                          placeholder="0.00"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">
                        Batch No
                      </label>
                      <div className="relative">
                        <Hash
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={18}
                        />
                        <input
                          type="text"
                          name="batch_No"
                          value={medForm.batch_No}
                          onChange={handleMedChange}
                          placeholder="e.g. B001"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">
                        Quantity
                      </label>
                      <div className="relative">
                        <Layers
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={18}
                        />
                        <input
                          type="number"
                          name="quantity_In_Stock"
                          value={medForm.quantity_In_Stock}
                          onChange={handleMedChange}
                          placeholder="0"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-text px-1 uppercase">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                        size={18}
                      />
                      <input
                        type="date"
                        name="expiry_Date"
                        value={medForm.expiry_Date}
                        onChange={handleMedChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm"
                      />
                    </div>
                  </div>
                  {medError && (
                    <p className="text-darkred text-xs text-center font-medium">
                      {medError}
                    </p>
                  )}
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={closeMedicineModal}
                      className="flex-1 py-4 rounded-2xl font-bold text-muted-text hover:bg-background transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={medLoading}
                      className="flex-1 py-4 bg-mintgreen text-inverse-text rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {medLoading ? "Saving..." : "Save Product"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Add Order Modal ===== */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={closeOrderModal}
          />
          <div className="relative bg-secondary w-full max-w-lg rounded-[40px] shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-primary-text tracking-tight">
                    Create New Order
                  </h2>
                  <p className="text-xs text-muted-text mt-1">
                    Select products and enter customer info
                  </p>
                </div>
                <button
                  onClick={closeOrderModal}
                  className="p-2 hover:bg-background rounded-full transition-colors"
                >
                  <X size={20} className="text-muted-text" />
                </button>
              </div>

              {orderSuccess ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-16 h-16 bg-mintgreen/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl text-mintgreen">✓</span>
                  </div>
                  <p className="text-lg font-black text-primary-text">
                    Order Created!
                  </p>
                  <p className="text-xs text-muted-text">
                    Closing automatically...
                  </p>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleOrderSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-text px-1 uppercase">
                      Customer
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                        size={18}
                      />
                      <select
                        name="client_ID"
                        value={orderForm.client_ID}
                        onChange={handleOrderChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm appearance-none"
                      >
                        <option value="">Select customer...</option>
                        {clients.map((c: any) => (
                          <option key={c.id} value={c.id}>
                            {c.client_Name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-text px-1 uppercase">
                      Medicine
                    </label>
                    <div className="relative">
                      <Package
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                        size={18}
                      />
                      <select
                        name="medicine_ID"
                        value={orderForm.medicine_ID}
                        onChange={handleOrderChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm appearance-none"
                      >
                        <option value="">Select medicine...</option>
                        {medicines.map((m: any) => (
                          <option key={m.medicine_ID} value={m.medicine_ID}>
                            {m.medicine_Name} — {m.quantity_In_Stock} in stock
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-text px-1 uppercase">
                      Quantity
                      {orderForm.medicine_ID && (
                        <span className="ml-2 text-muted-text normal-case font-normal">
                          (Available:{" "}
                          {medicines.find(
                            (m: any) =>
                              m.medicine_ID === parseInt(orderForm.medicine_ID),
                          )?.quantity_In_Stock ?? 0}
                          )
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <Layers
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                        size={18}
                      />
                      <input
                        type="number"
                        name="quantity"
                        value={orderForm.quantity}
                        onChange={handleOrderChange}
                        placeholder="1"
                        min="1"
                        max={
                          medicines.find(
                            (m: any) =>
                              m.medicine_ID === parseInt(orderForm.medicine_ID),
                          )?.quantity_In_Stock ?? undefined
                        }
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background text-primary-text rounded-2xl outline-none border border-gray-200 dark:border-gray-700 focus:border-mintgreen transition-all text-sm"
                      />
                    </div>
                  </div>

                  {orderError && (
                    <p className="text-darkred text-xs text-center font-medium">
                      {orderError}
                    </p>
                  )}

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={closeOrderModal}
                      className="flex-1 py-4 rounded-2xl font-bold text-muted-text hover:bg-background transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={orderLoading}
                      className="flex-1 py-4 bg-mintgreen text-inverse-text rounded-2xl font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {orderLoading ? "Creating..." : "Complete Order"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Topbar;
