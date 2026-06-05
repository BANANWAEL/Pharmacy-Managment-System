import ProfileNavbar from "@/components/manager-dash/Profile&settings/navbar";

export default function ProfileSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <div>
            <ProfileNavbar/>
    <div className="min-h-screen w-full bg-background overflow-hidden">
      {children}
    </div>
    </div>
  );
}