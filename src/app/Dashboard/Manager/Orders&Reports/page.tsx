"use client";
import OrdersHeadline from "@/components/manager-dash/Orders&Reports/headline"
import InventoryReport from "@/components/manager-dash/Orders&Reports/InventoryReport"
import SalesOrders from "@/components/manager-dash/Orders&Reports/SalesOrders"
import SalesOrdersTable from "@/components/manager-dash/Orders&Reports/SalesOrders"
import SalesReport from "@/components/manager-dash/Orders&Reports/SalesReport";
export default function OrdersandReports(){
    return(
        <div>
           <OrdersHeadline/>
           <SalesOrdersTable/>
           <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary-text">Generate Reports</h1>
        <p className="text-muted-text">Create and export various pharmacy reports</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SalesReport />
        <InventoryReport  />
      </div>
    </div>
        </div>
    )
}