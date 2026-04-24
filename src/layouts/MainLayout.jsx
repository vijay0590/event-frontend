import Navbar from "../components/Navbar";

Navbar
const MainLayout=({children})=>{
    return(
    <>
    <Navbar/>
    <div className="p-5 bg-gray-50 min-h-screen">{children}</div>
    </>
    )
}
export default MainLayout;