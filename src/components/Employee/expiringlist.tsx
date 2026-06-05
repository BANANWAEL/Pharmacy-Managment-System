// "use client";
// import { useState } from "react";

// export default function ExpiringList() {
//   const [showModal, setShowModal] = useState(false);

//   // تخيلي إن دي البيانات اللي جاية من الـ DB
//   const allProducts = [
//     { id: 1, name: "Doxycycline", date: "24 Dec 2026", qty: 40 },
//     { id: 2, name: "Abetis", date: "20 Dec 2026", qty: 15 },
//     { id: 3, name: "Panadol", date: "15 Jan 2027", qty: 100 },
//     { id: 4, name: "Augmentin", date: "10 Feb 2027", qty: 25 },
//     { id: 5, name: "C-Retard", date: "05 Mar 2027", qty: 60 },
//     { id: 6, name: "Zithromax", date: "12 Mar 2027", qty: 10 },
//     { id: 7, name: "Brufen", date: "18 Apr 2027", qty: 45 },
//   ];

//   // عرض أول 5 فقط في الجدول الرئيسي
//   const limitedProducts = allProducts.slice(0, 4);

//   return (
//     <>
//       <div className="bg-secondary p-6 rounded-4xl shadow-sm flex-1">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="font-bold text-lg text-primary-text">Expiring List</h2>
//           {/* عند الضغط يفتح الـ Modal */}

//           <button
//             onClick={() => setShowModal(true)}
//             className="text-xs font-bold text-muted-text hover:text-mintgreen dark:hover:text-softgreen transition-colors duration-200"
//           >
//             See All &gt;
//           </button>
//         </div>

//         <table className="w-full text-left">
//           <thead>
//             <tr className="text-muted-text text-xs border-b border-gray-100 dark:border-gray-800">
//               <th className="pb-2 font-medium">Medicine name</th>
//               <th className="pb-2 font-medium">Expire Date</th>
//               <th className="pb-2 font-medium">Quantity</th>
//             </tr>
//           </thead>
//           <tbody className="text-sm">
//             {limitedProducts.map((item) => (
//               <tr
//                 key={item.id}
//                 className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
//               >
//                 <td className="py-2 font-semibold text-primary-text">
//                   {item.name}
//                 </td>
//                 <td className="py-2 text-muted-text">{item.date}</td>
//                 <td className="py-2 text-primary-text">{item.qty}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* --- الـ Modal (الشاشة الصغيرة المنبثقة) --- */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="bg-background dark:bgbackground w-full max-w-2xl max-h-[80vh] rounded-4xl shadow-2xl overflow-hidden flex flex-col">
//             {/* Header الـ Modal */}
//             <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
//               <h2 className="font-bold text-xl text-primary-text">
//                 All Expiring Products
//               </h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"
//               >
//                 ✕
//               </button>
//             </div>

//             {/* محتوى الجدول الكامل مع Scroll داخلي */}
//             <div className="p-6 overflow-y-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="text-muted-text text-xs border-b border-gray-100 dark:border-gray-800">
//                     <th className="pb-4">Medicine name</th>
//                     <th className="pb-4">Expire Date</th>
//                     <th className="pb-4">Quantity</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-sm">
//                   {allProducts.map((item) => (
//                     <tr
//                       key={item.id}
//                       className="border-b border-gray-50 dark:border-gray-800/50"
//                     >
//                       <td className="py-4 font-semibold text-primary-text">
//                         {item.name}
//                       </td>
//                       <td className="py-4 text-muted-text">{item.date}</td>
//                       <td className="py-4 text-primary-text">{item.qty}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";

// fallback static data if backend fails
const staticProducts = [
  { id: 1, name: "Doxycycline", date: "24 Dec 2026", qty: 40 },
  { id: 2, name: "Abetis", date: "20 Dec 2026", qty: 15 },
  { id: 3, name: "Panadol", date: "15 Jan 2027", qty: 100 },
  { id: 4, name: "Augmentin", date: "10 Feb 2027", qty: 25 },
  { id: 5, name: "C-Retard", date: "05 Mar 2027", qty: 60 },
  { id: 6, name: "Zithromax", date: "12 Mar 2027", qty: 10 },
  { id: 7, name: "Brufen", date: "18 Apr 2027", qty: 45 },
];

export default function ExpiringList() {
  const [showModal, setShowModal] = useState(false);
  const [allProducts, setAllProducts] = useState(staticProducts);

  useEffect(() => {
    const fetchExpiring = async () => {
      try {
        const response = await api.get("/InventoryAlerts/status");
        const data = response.data;
        console.log("First lowStock item:", data.lowStock[0]);

        // map backend data if it exists
        const mapped = data.lowStock.map((item: any, index: number) => ({
          id: item.medicine_ID,
          name: item.medicine_Name,
          date: item.expiry_Date
            ? new Date(item.expiry_Date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A",
          qty: item.quantity_In_Stock,
        }));
        setAllProducts(mapped);
        // if empty → keeps staticProducts as fallback
      } catch (err) {
        console.error("Failed to fetch expiring list:", err);
        // keeps staticProducts as fallback
      }
    };

    fetchExpiring();
  }, []);

  const limitedProducts = allProducts.slice(0, 4);

  return (
    <>
      <div className="bg-secondary p-6 rounded-4xl shadow-sm flex-1">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg text-primary-text">Low Stock</h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs font-bold text-muted-text hover:text-mintgreen dark:hover:text-softgreen transition-colors duration-200"
          >
            See All &gt;
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-muted-text text-xs border-b border-gray-100 dark:border-gray-800">
              <th className="pb-2 font-medium">Medicine name</th>
              <th className="pb-2 font-medium">Expire Date</th>
              <th className="pb-2 font-medium">Quantity</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {limitedProducts.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 dark:border-gray-800/50 last:border-0"
              >
                <td className="py-2 font-semibold text-primary-text">
                  {item.name}
                </td>
                <td className="py-2 text-muted-text">{item.date}</td>
                <td className="py-2 text-primary-text">{item.qty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background w-full max-w-2xl max-h-[80vh] rounded-4xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="font-bold text-xl text-primary-text">
               All Low Stock Products
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted-text text-xs border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-4">Medicine name</th>
                    <th className="pb-4">Expire Date</th>
                    <th className="pb-4">Quantity</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {allProducts.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-50 dark:border-gray-800/50"
                    >
                      <td className="py-4 font-semibold text-primary-text">
                        {item.name}
                      </td>
                      <td className="py-4 text-muted-text">{item.date}</td>
                      <td className="py-4 text-primary-text">{item.qty}</td>
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
