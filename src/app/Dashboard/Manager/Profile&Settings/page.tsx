import AdminProfile from "@/components/manager-dash/Profile&settings/Home/AdminProfile";
import ChangePassword from "@/components/manager-dash/Profile&settings/Home/ChangePassword";

export default function ProfileSettings(){
    return(
        <div>
           <AdminProfile/>
           <ChangePassword/>
        </div>
    )
}