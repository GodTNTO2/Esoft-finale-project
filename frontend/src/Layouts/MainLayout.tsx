import { Outlet } from "react-router-dom"
import NavBar from "../Bars/NavBar"
import Footer from "../Bars/Footer"


const MainLayout = () => {

    return( 
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    )
}

export default MainLayout