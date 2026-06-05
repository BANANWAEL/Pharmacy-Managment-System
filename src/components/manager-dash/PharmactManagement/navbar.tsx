import DynamicHeader from "../navbar";
const profileTabs = [
  { label: "Medicines", href: "/Dashboard/Manager/PharmacyManagement" },
  { label: "Inventory", href: "/Dashboard/Manager/PharmacyManagement/Inventory" },
  { label: "Suppliers", href: "/Dashboard/Manager/PharmacyManagement/Suppliers" },
];

export default function PHNavbar() {
  return (
    <div>
      <DynamicHeader
        title="Pharmacy Management"
        subtitle="Manage medicines, inventory, and suppliers"
        tabs={profileTabs}
      />
    </div>
  );
}
