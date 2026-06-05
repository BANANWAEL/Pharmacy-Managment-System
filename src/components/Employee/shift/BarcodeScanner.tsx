import { ScanBarcode } from "lucide-react";

const BarcodeScanner = () => {
  return (
    <div className="bg-darkgreen w-full p-4 rounded-4xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-opacity  shadow-lg shadow-green-500/20">
      <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
        <ScanBarcode size={40} className="text-white" />
      </div>
      <h2 className="text-xl font-black text-white tracking-tight">Scan Barcode</h2>
    </div>
  );
};

export default BarcodeScanner;