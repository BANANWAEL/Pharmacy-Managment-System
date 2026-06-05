// "use client";

// import React, { useState } from 'react';

// import {

//   Search, Package, Edit2, Trash2, Plus, AlertCircle,

//   CheckCircle, X, DollarSign, Calendar, Tag, Truck, Hash

// } from 'lucide-react';

// interface Medicine {

//   id: number;

//   name: string;

//   category: string;

//   price: number;

//   quantity: number;

//   expiryDate: string;

//   status: 'In Stock' | 'Low Stock' | 'Out of Stock';

//   supplier: string;

// }

// const MedicinesManagement: React.FC = () => {

//   // --- States ---

//   const [searchTerm, setSearchTerm] = useState('');

//   const [selectedCategory, setSelectedCategory] = useState('All');

//   // States للمودالات

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

//   const medicines: Medicine[] = [

//     { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', price: 5.99, quantity: 450, expiryDate: '2026-12-31', status: 'In Stock', supplier: 'MediSupply Co.' },

//     { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotics', price: 12.50, quantity: 15, expiryDate: '2026-03-15', status: 'Low Stock', supplier: 'PharmaCorp' },

//     { id: 3, name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 7.25, quantity: 320, expiryDate: '2027-06-20', status: 'In Stock', supplier: 'MediSupply Co.' },

//     { id: 4, name: 'Aspirin 100mg', category: 'Cardiovascular', price: 4.99, quantity: 8, expiryDate: '2026-02-28', status: 'Low Stock', supplier: 'HealthPlus Ltd' },

//     { id: 5, name: 'Omeprazole 20mg', category: 'Gastric', price: 15.00, quantity: 0, expiryDate: '2026-08-10', status: 'Out of Stock', supplier: 'PharmaCorp' },

//     { id: 6, name: 'Metformin 500mg', category: 'Diabetes', price: 18.75, quantity: 200, expiryDate: '2027-01-15', status: 'In Stock', supplier: 'HealthPlus Ltd' },

//     { id: 7, name: 'Cetirizine 10mg', category: 'Allergy', price: 6.50, quantity: 12, expiryDate: '2026-04-30', status: 'Low Stock', supplier: 'MediSupply Co.' },

//     { id: 8, name: 'Vitamin D3 1000IU', category: 'Vitamins', price: 9.99, quantity: 500, expiryDate: '2027-11-25', status: 'In Stock', supplier: 'PharmaCorp' },

//   ];

//   const categories = ['All', ...new Set(medicines.map(m => m.category))];

//   const filteredMedicines = medicines.filter(medicine => {

//     const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||

//                           medicine.category.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;

//     return matchesSearch && matchesCategory;

//   });

//   const getStatusStyle = (status: string) => {

//     switch (status) {

//       case 'In Stock': return 'bg-softgreen/20 text-darkgreen';

//       case 'Low Stock': return 'bg-softyellow/30 text-[#D97706]';

//       case 'Out of Stock': return 'bg-softred/20 text-darkred';

//       default: return 'bg-background text-muted-text';

//     }

//   };

//   // --- Handlers ---

//   const handleOpenEdit = (medicine: Medicine) => {

//     setSelectedMedicine(medicine);

//     setIsEditModalOpen(true);

//   };

//   const handleCloseModals = () => {

//     setIsEditModalOpen(false);

//     setIsAddModalOpen(false);

//     setSelectedMedicine(null);

//   };

//   return (

//     <div className="bg-secondary p-6 rounded-2xl shadow-sm border border-background">

//       {/* Header Section */}

//       <div className="flex justify-between items-center mb-2">

//         <h1 className="text-2xl font-bold text-primary-text tracking-tight">Medicines Management</h1>

//         <button

//           onClick={() => setIsAddModalOpen(true)}

//           className="flex items-center gap-2 bg-darkgreen text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm"

//         >

//           <Plus size={20} />

//           Add Medicine

//         </button>

//       </div>

//       {/* Search and Filter Section */}

//       <div className="flex flex-col gap-4 mb-2">

//         <div className="relative">

//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />

//           <input

//             type="text"

//             placeholder="Search medicines by name or category..."

//             value={searchTerm}

//             onChange={(e) => setSearchTerm(e.target.value)}

//             className="w-full pl-12 pr-4 py-2.5 bg-background text-primary-text rounded-xl outline-none border border-transparent focus:border-softgreen transition-all text-sm"

//           />

//         </div>

//         <div className="flex gap-2 overflow-x-auto scrollbar-hide">

//           {categories.map(category => (

//             <button

//               key={category}

//               onClick={() => setSelectedCategory(category)}

//               className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${

//                 selectedCategory === category

//                   ? 'bg-mintgreen text-inverse-text shadow-md'

//                   : 'bg-background text-muted-text hover:text-primary-text'

//               }`}

//             >

//               {category}

//             </button>

//           ))}

//         </div>

//       </div>

//       {/* Medicines Table */}

//       <div className="overflow-x-auto">

//         <table className="w-full border-collapse">

//           <thead>

//             <tr className="border-b border-background">

//               <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Medicine Name</th>

//               <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Category</th>

//               <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Price</th>

//               <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Quantity</th>

//               <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Expiry Date</th>

//               <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Status</th>

//               <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Supplier</th>

//               <th className="text-right p-4 text-xs font-bold text-primary-text uppercase tracking-wider">Actions</th>

//             </tr>

//           </thead>

//           <tbody className="divide-y divide-background/50">

//             {filteredMedicines.map((medicine) => (

//               <tr key={medicine.id} className="hover:bg-background/30 transition-colors group">

//                 <td className="p-4 text-sm font-bold text-primary-text">{medicine.name}</td>

//                 <td className="p-4 text-sm text-primary-text">{medicine.category}</td>

//                 <td className="p-4 text-sm text-primary-text font-medium">EGP {medicine.price.toFixed(2)}</td>

//                 <td className="p-4 text-sm text-primary-text font-medium">{medicine.quantity}</td>

//                 <td className="p-4 text-sm text-primary-text">{medicine.expiryDate}</td>

//                 <td className="p-4">

//                   <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${getStatusStyle(medicine.status)}`}>

//                     {medicine.status}

//                   </span>

//                 </td>

//                 <td className="p-4 text-sm text-primary-text">{medicine.supplier}</td>

//                 <td className="p-4 text-right">

//                   <div className="flex justify-end gap-2">

//                     <button

//                       onClick={() => handleOpenEdit(medicine)}

//                       className="p-2 text-darkblue bg-softblue/20 rounded-lg transition-all"

//                       title="Edit"

//                     >

//                       <Edit2 size={16} />

//                     </button>

//                     <button className="p-2 text-red-600 hover:text-darkred hover:bg-softred/10 rounded-lg transition-all" title="Delete">

//                       <Trash2 size={16} />

//                     </button>

//                   </div>

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//       {/* --- 1. Add Medicine Modal --- */}

//       {isAddModalOpen && (

//         <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

//           <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" onClick={handleCloseModals} />

//           <div className="relative bg-secondary w-full max-w-xl rounded-[40px] shadow-2xl border border-background animate-in zoom-in-95 duration-300">

//             <div className="p-10">

//               <div className="flex justify-between items-start mb-2">

//                 <div>

//                   <h2 className="text-2xl font-black text-primary-text tracking-tight">Add New Medicine</h2>

//                   <p className="text-sm text-muted-text mt-1">Enter the details of the new medicine to add to inventory.</p>

//                 </div>

//                 <button onClick={handleCloseModals} className="p-2 hover:bg-background rounded-full transition-colors">

//                   <X size={24} className="text-muted-text" />

//                 </button>

//               </div>

//               <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

//                 {/* Medicine Name */}

//                 <div className="space-y-2">

//                   <label className="text-sm font-bold text-primary-text px-1">Medicine Name</label>

//                   <input

//                     type="text"

//                     placeholder="e.g., Paracetamol 500mg"

//                     className="w-full px-4 py-3 bg-background rounded-xl outline-none border border-gray-200 focus:border-mintgreen transition-all text-sm text-primary-text"

//                   />

//                 </div>

//                 {/* Category & Price */}

//                 <div className="grid grid-cols-2 gap-4">

//                   <div className="space-y-2">

//                     <label className="text-sm font-bold text-primary-text px-1">Category</label>

//                     <input type="text" placeholder="e.g., Pain Relief" className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text" />

//                   </div>

//                   <div className="space-y-2">

//                     <label className="text-sm font-bold text-primary-text px-1">Price (EGP)</label>

//                     <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text" />

//                   </div>

//                 </div>

//                 {/* Quantity & Expiry Date */}

//                 <div className="grid grid-cols-2 gap-4">

//                   <div className="space-y-2">

//                     <label className="text-sm font-bold text-primary-text px-1">Quantity</label>

//                     <input type="number" placeholder="0" className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text" />

//                   </div>

//                   <div className="space-y-2">

//                     <label className="text-sm font-bold text-primary-text px-1">Expiry Date</label>

//                     <input type="date" className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text" />

//                   </div>

//                 </div>

//                 {/* Supplier */}

//                 <div className="space-y-2">

//                   <label className="text-sm font-bold text-primary-text px-1">Supplier</label>

//                   <select className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text appearance-none cursor-pointer">

//                     <option value="">Select supplier</option>

//                     <option value="MediSupply">MediSupply Co.</option>

//                     <option value="PharmaCorp">PharmaCorp</option>

//                   </select>

//                 </div>

//                 <div className="flex gap-4 pt-4">

//                   <button type="button" onClick={handleCloseModals} className="flex-1 py-4 rounded-2xl font-bold text-muted-text hover:bg-background transition-colors">Cancel</button>

//                   <button type="submit" className="flex-1 py-4 bg-mintgreen text-inverse-text rounded-2xl font-bold shadow-lg shadow-mintgreen/20">Save Product</button>

//                 </div>

//               </form>

//             </div>

//           </div>

//         </div>

//       )}

//       {/* --- 2. Edit Medicine Modal --- */}

//       {isEditModalOpen && selectedMedicine && (

//         <div className="fixed inset-0 z-100 flex items-center justify-center p-4">

//           <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" onClick={handleCloseModals} />

//           <div className="relative bg-secondary w-full max-w-xl rounded-[40px] shadow-2xl border border-background animate-in zoom-in-95 duration-300">

//             <div className="p-10">

//               <div className="flex justify-between items-start mb-8">

//                 <div>

//                   <h2 className="text-2xl font-black text-primary-text tracking-tight">Edit Medicine</h2>

//                   <p className="text-sm text-muted-text mt-1">Update information for <span className="text-mintgreen font-bold">{selectedMedicine.name}</span></p>

//                 </div>

//                 <button onClick={handleCloseModals} className="p-2 hover:bg-background rounded-full transition-colors group">

//                   <X size={24} className="text-muted-text group-hover:text-darkred" />

//                 </button>

//               </div>

//               <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>

//                 <div className="space-y-2">

//                   <label className="text-xs font-black text-primary-text px-1 uppercase tracking-widest">Medicine Name</label>

//                   <div className="relative">

//                     <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />

//                     <input type="text" defaultValue={selectedMedicine.name} className="w-full pl-12 pr-4 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text font-medium" />

//                   </div>

//                 </div>

//                 <div className="grid grid-cols-2 gap-4">

//                   <div className="space-y-2">

//                     <label className="text-xs font-black text-primary-text px-1 uppercase tracking-widest">Category</label>

//                     <div className="relative">

//                       <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />

//                       <input type="text" defaultValue={selectedMedicine.category} className="w-full pl-12 pr-4 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text" />

//                     </div>

//                   </div>

//                   <div className="space-y-2">

//                     <label className="text-xs font-black text-primary-text px-1 uppercase tracking-widest">Supplier</label>

//                     <div className="relative">

//                       <Truck className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={18} />

//                       <input type="text" defaultValue={selectedMedicine.supplier} className="w-full pl-12 pr-4 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text" />

//                     </div>

//                   </div>

//                 </div>

//                 <div className="grid grid-cols-3 gap-4">

//                   <div className="space-y-2">

//                     <label className="text-xs font-black text-primary-text px-1 uppercase tracking-widest">Price</label>

//                     <div className="relative">

//                       <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={16} />

//                       <input type="number" defaultValue={selectedMedicine.price} className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text" />

//                     </div>

//                   </div>

//                   <div className="space-y-2">

//                     <label className="text-xs font-black text-primary-text px-1 uppercase tracking-widest">Stock</label>

//                     <div className="relative">

//                       <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={16} />

//                       <input type="number" defaultValue={selectedMedicine.quantity} className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text" />

//                     </div>

//                   </div>

//                   <div className="space-y-2">

//                     <label className="text-xs font-black text-primary-text px-1 uppercase tracking-widest">Expiry</label>

//                     <div className="relative">

//                       <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text" size={16} />

//                       <input type="text" defaultValue={selectedMedicine.expiryDate} className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text" />

//                     </div>

//                   </div>

//                 </div>

//                 <div className="flex gap-4 pt-6">

//                   <button type="button" onClick={handleCloseModals} className="flex-1 py-4 rounded-2xl font-bold text-muted-text hover:bg-background transition-colors">Discard</button>

//                   <button type="submit" className="flex-1 py-4 bg-mintgreen text-inverse-text rounded-2xl font-bold shadow-lg shadow-mintgreen/20 hover:opacity-90 transition-all">Save Changes</button>

//                 </div>

//               </form>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>

//   );

// };

// export default MedicinesManagement;

"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Package,
  Edit2,
  Trash2,
  Plus,
  X,
  DollarSign,
  Calendar,
  Tag,
  Truck,
  Hash,
  Layers,
} from "lucide-react";
import api from "@/lib/api";

interface Medicine {
  id: number;
  name: string;
  sellingPrice: number;
  costPrice: number;
  quantity: number;
  expiryDate: string;
  batchNo: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const getStatus = (qty: number): Medicine["status"] => {
  if (qty === 0) return "Out of Stock";
  if (qty <= 20) return "Low Stock";
  return "In Stock";
};

const MedicinesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const categories = ["All", ...new Set(medicines.map((m) => m.batchNo))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [addForm, setAddForm] = useState({
    medicine_Name: "",
    selling_Price: "",
    cost_Price: "",
    batch_No: "",
    quantity_In_Stock: "",
    expiry_Date: "",
  });

  const [editForm, setEditForm] = useState({
    medicine_Name: "",
    selling_Price: "",
    cost_Price: "",
    batch_No: "",
    quantity_In_Stock: "",
    expiry_Date: "",
  });

  // ===== FETCH =====
  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await api.get("/Medicines");
      const data = response.data;

      const mapped: Medicine[] = data.map((item: any) => ({
        id: item.medicine_ID,
        name: item.medicine_Name,
        sellingPrice: item.selling_Price,
        costPrice: item.cost_Price,
        quantity: item.quantity_In_Stock,
        expiryDate:
          item.expiry_Date && !item.expiry_Date.startsWith("0001")
            ? new Date(item.expiry_Date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
        batchNo: item.batch_No,
        status: getStatus(item.quantity_In_Stock),
      }));
      setMedicines(mapped);
    } catch (err) {
      console.error("Failed to fetch medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ===== HELPERS =====
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "In Stock":
        return "bg-softgreen/20 text-darkgreen";
      case "Low Stock":
        return "bg-softyellow/30 text-[#D97706]";
      case "Out of Stock":
        return "bg-softred/20 text-darkred";
      default:
        return "bg-background text-muted-text";
    }
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedMedicine(null);
    setError("");
    setSuccess(false);
    setAddForm({
      medicine_Name: "",
      selling_Price: "",
      cost_Price: "",
      batch_No: "",
      quantity_In_Stock: "",
      expiry_Date: "",
    });
  };

  const openEditModal = (med: Medicine) => {
    setSelectedMedicine(med);
    setEditForm({
      medicine_Name: med.name,
      selling_Price: med.sellingPrice.toString(),
      cost_Price: med.costPrice.toString(),
      batch_No: med.batchNo,
      quantity_In_Stock: med.quantity.toString(),
      expiry_Date: "",
    });
    setError("");
    setIsEditModalOpen(true);
  };

  // ===== ADD =====
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    try {
      await api.post("/Medicines", {
        medicine_Name: addForm.medicine_Name,
        selling_Price: parseFloat(addForm.selling_Price),
        cost_Price: parseFloat(addForm.cost_Price),
        batch_No: addForm.batch_No,
        quantity_In_Stock: parseInt(addForm.quantity_In_Stock),
        expiry_Date: new Date(addForm.expiry_Date).toISOString(),
      });
      setSuccess(true);
      await fetchMedicines();
      setTimeout(() => closeModals(), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to add medicine.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ===== EDIT =====
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;
    setSubmitLoading(true);
    setError("");
    try {
      await api.put(`/Medicines/${selectedMedicine.id}`, {
        medicine_Name: editForm.medicine_Name,
        selling_Price: parseFloat(editForm.selling_Price),
        cost_Price: parseFloat(editForm.cost_Price),
        batch_No: editForm.batch_No,
        quantity_In_Stock: parseInt(editForm.quantity_In_Stock),
        expiry_Date: editForm.expiry_Date
          ? new Date(editForm.expiry_Date).toISOString()
          : new Date().toISOString(),
      });
      setSuccess(true);
      await fetchMedicines();
      setTimeout(() => closeModals(), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to update medicine.");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ===== DELETE =====
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await api.delete(`/Medicines/${id}`);
      setMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete medicine:", err);
    }
  };

  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || m.batchNo === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const SuccessState = () => (
    <div className="flex flex-col items-center justify-center py-8 gap-3">
      <div className="w-16 h-16 bg-mintgreen/10 rounded-full flex items-center justify-center">
        <span className="text-3xl text-mintgreen">✓</span>
      </div>
      <p className="text-lg font-black text-primary-text">Done!</p>
      <p className="text-xs text-muted-text">Closing automatically...</p>
    </div>
  );

  return (
    <div className="bg-secondary p-6 rounded-2xl shadow-sm border border-background">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold text-primary-text tracking-tight">
          Medicines Management
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-darkgreen text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm"
        >
          <Plus size={20} /> Add Medicine
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-4 mb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
          <input
            type="text"
            placeholder="Search medicines by name or batch no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-background text-primary-text rounded-xl outline-none border border-transparent focus:border-softgreen transition-all text-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-mintgreen text-inverse-text shadow-md"
                  : "bg-background text-muted-text hover:text-primary-text"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-background">
              <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">
                Medicine Name
              </th>
              <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">
                Batch No
              </th>
              <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">
                Selling Price
              </th>
              <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">
                Cost Price
              </th>
              <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">
                Quantity
              </th>
              
              <th className="text-left p-4 text-xs font-bold text-primary-text uppercase tracking-wider">
                Status
              </th>
              <th className="text-right p-4 text-xs font-bold text-primary-text uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-background/50">
            {loading
              ? [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="p-4">
                        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : filteredMedicines.map((med) => (
                  <tr
                    key={med.id}
                    className="hover:bg-background/30 transition-colors"
                  >
                    <td className="p-4 text-sm font-bold text-primary-text">
                      {med.name}
                    </td>
                    <td className="p-4 text-sm text-muted-text">
                      {med.batchNo}
                    </td>
                    <td className="p-4 text-sm text-primary-text font-medium">
                      EGP {med.sellingPrice}
                    </td>
                    <td className="p-4 text-sm text-primary-text font-medium">
                      EGP {med.costPrice}
                    </td>
                    <td className="p-4 text-sm text-primary-text font-medium">
                      {med.quantity}
                    </td>
                    
                    <td className="p-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyle(med.status)}`}
                      >
                        {med.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => openEditModal(med)}
                          className="p-2 text-darkblue bg-softblue/20 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="p-2 text-red-600 hover:bg-softred/10 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!loading && filteredMedicines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-text">No medicines found</p>
          </div>
        )}
      </div>

      {/* ===== Add Modal ===== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={closeModals}
          />
          <div className="relative bg-secondary w-full max-w-xl rounded-[40px] shadow-2xl border border-background animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-primary-text">
                    Add New Medicine
                  </h2>
                  <p className="text-sm text-muted-text mt-1">
                    Enter the details to add to inventory
                  </p>
                </div>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-background rounded-full"
                >
                  <X size={24} className="text-muted-text" />
                </button>
              </div>

              {success ? (
                <SuccessState />
              ) : (
                <form className="space-y-4" onSubmit={handleAddSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary-text">
                      Medicine Name
                    </label>
                    <input
                      type="text"
                      value={addForm.medicine_Name}
                      onChange={(e) =>
                        setAddForm({
                          ...addForm,
                          medicine_Name: e.target.value,
                        })
                      }
                      placeholder="e.g., Paracetamol 500mg"
                      required
                      className="w-full px-4 py-3 bg-background rounded-xl outline-none border border-gray-200 focus:border-mintgreen text-sm text-primary-text"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-text">
                        Selling Price
                      </label>
                      <input
                        type="number"
                        value={addForm.selling_Price}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            selling_Price: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        required
                        className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-text">
                        Cost Price
                      </label>
                      <input
                        type="number"
                        value={addForm.cost_Price}
                        onChange={(e) =>
                          setAddForm({ ...addForm, cost_Price: e.target.value })
                        }
                        placeholder="0.00"
                        required
                        className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-text">
                        Batch No
                      </label>
                      <input
                        type="text"
                        value={addForm.batch_No}
                        onChange={(e) =>
                          setAddForm({ ...addForm, batch_No: e.target.value })
                        }
                        placeholder="e.g., B001"
                        required
                        className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-text">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={addForm.quantity_In_Stock}
                        onChange={(e) =>
                          setAddForm({
                            ...addForm,
                            quantity_In_Stock: e.target.value,
                          })
                        }
                        placeholder="0"
                        required
                        className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary-text">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={addForm.expiry_Date}
                      onChange={(e) =>
                        setAddForm({ ...addForm, expiry_Date: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-background rounded-xl outline-none text-sm text-primary-text"
                    />
                  </div>

                  {error && (
                    <p className="text-darkred text-xs text-center">{error}</p>
                  )}

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="flex-1 py-4 rounded-2xl font-bold text-muted-text hover:bg-background transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex-1 py-4 bg-mintgreen text-inverse-text rounded-2xl font-bold disabled:opacity-50"
                    >
                      {submitLoading ? "Saving..." : "Save Medicine"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {isEditModalOpen && selectedMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={closeModals}
          />
          <div className="relative bg-secondary w-full max-w-xl rounded-[40px] shadow-2xl border border-background animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-primary-text">
                    Edit Medicine
                  </h2>
                  <p className="text-sm text-muted-text mt-1">
                    Updating{" "}
                    <span className="text-mintgreen font-bold">
                      {selectedMedicine.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={closeModals}
                  className="p-2 hover:bg-background rounded-full"
                >
                  <X size={24} className="text-muted-text" />
                </button>
              </div>

              {success ? (
                <SuccessState />
              ) : (
                <form className="space-y-4" onSubmit={handleEditSubmit}>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-primary-text uppercase tracking-widest">
                      Medicine Name
                    </label>
                    <div className="relative">
                      <Package
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                        size={18}
                      />
                      <input
                        type="text"
                        value={editForm.medicine_Name}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            medicine_Name: e.target.value,
                          })
                        }
                        required
                        className="w-full pl-12 pr-4 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-primary-text uppercase tracking-widest">
                        Selling Price
                      </label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={16}
                        />
                        <input
                          type="number"
                          value={editForm.selling_Price}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              selling_Price: e.target.value,
                            })
                          }
                          required
                          className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-primary-text uppercase tracking-widest">
                        Cost Price
                      </label>
                      <div className="relative">
                        <DollarSign
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={16}
                        />
                        <input
                          type="number"
                          value={editForm.cost_Price}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              cost_Price: e.target.value,
                            })
                          }
                          required
                          className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-primary-text uppercase tracking-widest">
                        Batch No
                      </label>
                      <div className="relative">
                        <Hash
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={16}
                        />
                        <input
                          type="text"
                          value={editForm.batch_No}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              batch_No: e.target.value,
                            })
                          }
                          required
                          className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-primary-text uppercase tracking-widest">
                        Stock
                      </label>
                      <div className="relative">
                        <Layers
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={16}
                        />
                        <input
                          type="number"
                          value={editForm.quantity_In_Stock}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              quantity_In_Stock: e.target.value,
                            })
                          }
                          required
                          className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-primary-text uppercase tracking-widest">
                        Expiry
                      </label>
                      <div className="relative">
                        <Calendar
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text"
                          size={16}
                        />
                        <input
                          type="date"
                          value={editForm.expiry_Date}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              expiry_Date: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-3 py-4 bg-background rounded-2xl outline-none text-sm text-primary-text"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <p className="text-darkred text-xs text-center">{error}</p>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={closeModals}
                      className="flex-1 py-4 rounded-2xl font-bold text-muted-text hover:bg-background transition-colors"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="flex-1 py-4 bg-mintgreen text-inverse-text rounded-2xl font-bold disabled:opacity-50"
                    >
                      {submitLoading ? "Saving..." : "Save Changes"}
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

export default MedicinesManagement;
