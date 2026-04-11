import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar=()=>{
    const{user,setUser}=useContext(AuthContext);
    const handleLogout=()=>{
        localStorage.removeItem("token")
        setUser(null);
    };
    return(
    <div className="bg-black text-white p-3 sm:p-4 flex justify-between items-center">
    <h1 className="font-bold">Event Management</h1>
    <div className="flex gap-4">
        <Link to="/">Home</Link>
    {!user?(
        <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        </>

    ):(
        <>
        <span>{user.name}</span>
        <button onClick={handleLogout}>logout</button>
        </>

    )
    }
        
    </div>
    </div>
    )
}
export default Navbar;
