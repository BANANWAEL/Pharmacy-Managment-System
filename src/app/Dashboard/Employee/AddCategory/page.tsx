import OutOfStock from "@/components/Employee/AddCategory/OutOfStock";
import ExpiringList from "@/components/Employee/expiringlist";
import Header from "@/components/header";
import BarcodeScanner from "@/components/Employee/shift/BarcodeScanner";
import NewItemWithModal from "@/components/Employee/shift/NewItemsCard";

export default function Add() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <ExpiringList />
        <OutOfStock />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2 h-full">
        <BarcodeScanner />
        <NewItemWithModal />
      </div>
    </div>
  );
}
