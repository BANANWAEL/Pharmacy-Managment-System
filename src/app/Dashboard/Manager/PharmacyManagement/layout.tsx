import PHNavbar from "@/components/manager-dash/PharmactManagement/navbar";
export default function ProfileSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <PHNavbar />

      <div className="min-h-screen w-full bg-background overflow-hidden">
        {children}
      </div>
    </div>
  );
}
