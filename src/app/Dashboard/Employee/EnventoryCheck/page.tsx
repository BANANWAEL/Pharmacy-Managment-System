import OutOfStock from "@/components/Employee/AddCategory/OutOfStock";
import ExpiringList from "@/components/Employee/expiringlist";
import InStock from "@/components/Employee/InventoryCheck/instock";
import RecentOrders from "@/components/Employee/RecentOrders";

export default function Inventory(){
    return(
       <div>
       <div className="grid grid-col-2 md:grid-cols-2 gap-2 mt-auto">
               <ExpiringList/>
               <RecentOrders/>
             </div>
             <InStock/>
             <OutOfStock/>
             </div>
    )
}