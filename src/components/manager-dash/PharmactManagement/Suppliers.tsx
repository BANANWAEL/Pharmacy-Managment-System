"use client";
import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";
import api from "@/lib/api";

interface Supplier {
  id:          number;
  name:        string;
  contact:     string;
  address:     string;
  totalOrders: number;
  status:      "Active" | "Inactive";
}

const SuppliersManagement: React.FC = () => {
  const [searchTerm, setSearchTerm]   = useState("");
  const [suppliers, setSuppliers]     = useState<Supplier[]>([]);
  const [loading, setLoading]         = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [submitLoading, setSubmitLoading]     = useState(false);
  const [error, setError]                     = useState("");

  const [form, setForm] = useState({
    name:    "",
    contact: "",
    address: "",
    status:  "Active" as "Active" | "Inactive",
  });

  // ===== FETCH ALL =====
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Suppliers");
      const data     = response.data;
      console.log("Suppliers:", data[0]); // 🔍 check keys

      const mapped: Supplier[] = data.map((item: any) => ({
  id:          item.supplier_ID,
  name:        item.supplier_Name,
  contact:     item.supplier_Phone,
  address:     item.supplier_Address,
  totalOrders: 0,        // not returned by backend
  status:      "Active", // not returned by backend
}));
      setSuppliers(mapped);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSuppliers(); }, []);

  // ===== HELPERS =====
  const openAddModal = () => {
    setEditingSupplier(null);
    setForm({ name: "", contact: "", address: "", status: "Active" });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name:    supplier.name,
      contact: supplier.contact,
      address: supplier.address,
      status:  supplier.status,
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSupplier(null);
    setError("");
    setForm({ name: "", contact: "", address: "", status: "Active" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getStatusColor = (status: string) =>
    status === "Active"
      ? "bg-softgreen text-primary-text"
      : "bg-softred text-primary-text";

  // ===== ADD / EDIT =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const payload = {
  name:    form.name,
  phone:   form.contact,
  address: form.address,
};

      if (editingSupplier) {
        await api.put(`/Suppliers/${editingSupplier.id}`, payload);
      } else {
        await api.post("/Suppliers", payload);
      }

      await fetchSuppliers(); // refresh list
      closeModal();
    } catch (err: any) {
      setError(err.message || "Failed to save supplier.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    try {
      await api.delete(`/Suppliers/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete supplier:", err);
    }
  };

  // ===== FILTER =====
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contact.includes(searchTerm) ||
    s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-secondary rounded-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
        <h1 className="text-xl font-bold text-primary-text">Suppliers Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-darkgreen text-white px-5 py-1.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Supplier
        </button>
      </div>

      {/* Search */}
      <div className="mb-2">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-1.5 bg-background text-primary-text rounded-xl outline-none border border-transparent focus:border-softgreen transition-all text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-secondary rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-gray-100 dark:border-gray-700">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Supplier Name</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Contact</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Address</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-primary-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-background transition-colors">
                  <td className="p-4 text-sm font-medium text-primary-text">{supplier.name}</td>
                  <td className="p-4 text-sm text-muted-text">{supplier.contact}</td>
                  <td className="p-4 text-sm text-muted-text">{supplier.address}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(supplier)}
                        className="p-1.5 text-mintgreen hover:bg-mintgreen/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(supplier.id)}
                        className="p-1.5 text-darkred hover:bg-darkred/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-text">No suppliers found</p>
          </div>
        )}
      </div>

      {/* Modal — Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-2xl w-full max-w-md shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 pt-6 pb-3">
              <h2 className="text-lg font-semibold text-primary-text">
                {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
              </h2>
              <button onClick={closeModal} className="p-1 text-muted-text hover:text-primary-text rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3">
              <div>
                <label className="block text-xs font-medium text-muted-text mb-1">Supplier Name</label>
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleInputChange} placeholder="e.g., MediSupply Co." required
                  className="w-full px-3 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-text mb-1">Phone</label>
                <input
                  type="text" name="contact" value={form.contact}
                  onChange={handleInputChange} placeholder="+20 123 456 7890" required
                  className="w-full px-3 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-text mb-1">Address</label>
                <input
                  type="text" name="address" value={form.address}
                  onChange={handleInputChange} placeholder="Cairo, Egypt" required
                  className="w-full px-3 py-2 bg-background text-primary-text rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-mintgreen text-sm"
                />
              </div>

              {error && <p className="text-darkred text-xs text-center">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-primary-text rounded-lg hover:bg-background text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit" disabled={submitLoading}
                  className="flex-1 px-4 py-2 bg-mintgreen text-inverse-text rounded-lg hover:opacity-90 text-sm font-medium disabled:opacity-50"
                >
                  {submitLoading ? "Saving..." : editingSupplier ? "Save Changes" : "Add Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuppliersManagement;