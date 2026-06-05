"use client";
import ShiftStatus from "@/components/Employee/shift/ShiftStatus";
import BarcodeScanner from "@/components/Employee/shift/BarcodeScanner";
import NewItemWithModal from "@/components/Employee/shift/NewItemsCard";
import ExpiringList from "@/components/Employee/expiringlist"; 
import ShiftPerformance from "@/components/Employee/shift/shiftperformancecards";
export default function EmployeeDashboard() {
  return (
    <div className="space-y-2">
      {/* 1. Shift Times */}
      <ShiftStatus />

      {/* 2. Big Green Scanner */}
      <BarcodeScanner />

       {/* 3. Mid Section (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <ExpiringList />
        <NewItemWithModal />
      </div>
     <div> <ShiftPerformance/></div>
    </div>
  );
}