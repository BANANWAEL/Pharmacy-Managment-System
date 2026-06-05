import DynamicHeader from "../navbar";
const profileTabs = [
  { label: "Profile", href: "/Dashboard/Manager/Profile&Settings" },
  { label: "Employees", href: "/dashboard/settings/employees" },
  { label: "Settings", href: "/dashboard/settings/general" },
];

export default function ProfileNavbar() {
  return (
    <div>
      <DynamicHeader
        title="Profile & Settings"
        subtitle="Manage your profile and pharmacy settings"
        tabs={profileTabs}
      />
    </div>
  );
}
