import Navbar from "../components/Navbar";

Navbar
const MainLayout=({children})=>{
    return(
    <>
    <Navbar/>
    <div className="p-5">{children}</div>
    </>
    )
}
export default MainLayout;