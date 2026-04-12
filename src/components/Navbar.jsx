import { Link ,useNavigate} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar=()=>{
    const{user,setUser}=useContext(AuthContext);
    const navigate=useNavigate();
    const handleLogout=()=>{
        localStorage.removeItem("token")
        setUser(null);
        navigate("/login");
    };
   const role = (user?.role || user?.accountType)?.toLowerCase();
  
    return(
    <div className="bg-black text-white p-3 sm:p-4 flex justify-between items-center">
    <h1 className="font-bold">Event Management</h1>
    <div className="flex gap-4 font-sm">
        <Link to="/">Home</Link>
        {/*not logged */}
    {!user && (
        <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        </>
    )}
      {/* user */}
    {role === "user" &&(
        <>
        <Link to="/my-tickets">My Tickets</Link>
        </>
    )}
     {/* organiser*/}
     {role === "organiser" &&(
          
        <Link to="/create-event">Create Event</Link>
         )}

      {/* admin */}
        {role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}

          {/* user info */}
          {user&&(
         <>
        <span className="text-md">{user.name}</span>
        <button onClick={handleLogout}
        className="bg-red-500 px-2 py-1 rounded"
        >logout</button>
        </>

    )}
    
        
    </div>
    </div>
    )
}
export default Navbar;
