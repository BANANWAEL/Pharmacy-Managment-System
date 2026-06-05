"use client";
import { useState } from "react";
import { PlusSquare, X, Package, Calendar, DollarSign, Hash, Layers } from "lucide-react";
import api from "@/lib/api";

const NewItemWithModal = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const [form, setForm] = useState({
    medicine_Name:      "",
    selling_Price:      "",
    cost_Price:         "",
    batch_No:           "",
    quantity_In_Stock:  "",
    expiry_Date:        "",
  });

  const closeModal = () => {
    setIsOpen(false);
    setSuccess(false);
    setError("");
    setForm({
      medicine_Name:     "",
      selling_Price:     "",
      cost_Price:        "",
      batch_No:          "",
      quantity_In_Stock: "",
      expiry_Date:       "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/Medicines", {
        medicine_Name:     form.medicine_Name,
        selling_Price:     parseFloat(form.selling_Price),
        cost_Price:        parseFloat(form.cost_Price),
        batch_No:          form.batch_No,
        quantity_In_Stock: parseInt(form.quantity_In_Stock),
        expiry_Date:       new Date(form.expiry_Date).toISOString(),
      });

      setSuccess(true);
      setTimeout(() => closeModal(), 1500); // close after success
    } catch (err: any) {
      setError(err.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="bg-white dark:bg-secondary h-full rounded-[40px] p-8 flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer group min-h-[250px]"
      >
        <div className="relative">
          <PlusSquare size={64} className="text-primary-text group-hover:scale-110 transition-transform duration-300" />
        </div>
        <p className="text-xl font-bold text-primary-text">Add New Items</p>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={closeModal}
          />

          <div className="relative bg-white dark:bg-secondary w-full max-w-lg rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-300">
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-primary-text tracking-tight">Add New Product</h2>
                  <p className="text-xs text-muted-text mt-1">Fill in the product details to add to inventory</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-background rounded-full transition-colors duration-300"
                >
                  <X size={20} className="text-muted-text" />
                </button>
              </div>

              {/* Success State */}
              {success ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-16 h-16 bg-mintgreen/10 rounded-full flex items-center justify-center">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="text-lg font-black text-primary-text">Product Added!</p>
                  <p className="text-xs text-muted-text">Closing automatically...</p>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>

                  {/* Medicine Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-text px-1 uppercase">Product Name</label>
                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                      <input
                        type="text"
                        name="medicine_Name"
                        value={form.medicine_Name}
                        onChange={handleChange}
                        placeholder="e.g. Panadol Extra"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background dark:bg-background/50 rounded-2xl outline-none border border-transparent focus:border-mintgreen transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Selling Price + Cost Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">Selling Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                        <input
                          type="number"
                          name="selling_Price"
                          value={form.selling_Price}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background dark:bg-background/50 rounded-2xl outline-none border border-transparent focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">Cost Price</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                        <input
                          type="number"
                          name="cost_Price"
                          value={form.cost_Price}
                          onChange={handleChange}
                          placeholder="0.00"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background dark:bg-background/50 rounded-2xl outline-none border border-transparent focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Batch No + Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">Batch No</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                        <input
                          type="text"
                          name="batch_No"
                          value={form.batch_No}
                          onChange={handleChange}
                          placeholder="e.g. B001"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background dark:bg-background/50 rounded-2xl outline-none border border-transparent focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary-text px-1 uppercase">Quantity</label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                        <input
                          type="number"
                          name="quantity_In_Stock"
                          value={form.quantity_In_Stock}
                          onChange={handleChange}
                          placeholder="0"
                          required
                          className="w-full pl-12 pr-4 py-4 bg-background dark:bg-background/50 rounded-2xl outline-none border border-transparent focus:border-mintgreen transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary-text px-1 uppercase">Expiry Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />
                      <input
                        type="date"
                        name="expiry_Date"
                        value={form.expiry_Date}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background dark:bg-background/50 rounded-2xl outline-none border border-transparent focus:border-mintgreen transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-darkred text-xs text-center font-medium">{error}</p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 py-4 rounded-2xl font-bold text-muted-text hover:bg-gray-100 dark:hover:bg-background transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-mintgreen text-white rounded-2xl font-bold shadow-lg shadow-mintgreen/20 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Product"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewItemWithModal;