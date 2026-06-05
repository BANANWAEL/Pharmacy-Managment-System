//Dashboard/layput.tsx
"use client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
//   4. عرض محتوى الداشبورد إذا كان المستخدم مصرح له
  return <div className="dashboard-container">{children}</div>;
}