import { Outlet } from "react-router-dom"
import RightBar from "../Bars/RightBar"


const AdminLayout = () => {


    return(
        <>
            <RightBar /> 
            <Outlet />
        </>
    )
}

export default AdminLayout