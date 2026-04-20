import { Link, useNavigate,useLocation } from "react-router-dom";
import { useContext,useState} from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location=useLocation();
        const [open, setOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem("token")
        setUser(null);
        navigate("/login");
    };
    const role = (user?.role || user?.accountType)?.toLowerCase();
    const activeClass=(path)=>{
        return location.pathname===path
        ?"text-yellow-400 font-bold":""
    }

   return (
  <div className="bg-slate-900 text-white px-6 py-3 shadow-md">
    
    <div className="flex justify-between items-center">
      
      <button 
        className="md:hidden text-2xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      <h1 className="font-bold text-lg tracking-wide cursor-pointer">
        EventX
      </h1>

      <div className="hidden md:flex gap-6 items-center text-sm">

        <Link to="/" className={activeClass("/")}>Home</Link>

        {!user && (
          <>
            <Link to="/login" className={activeClass("/login")}>Login</Link>
            <Link to="/register" className={activeClass("/register")}>Register</Link>
          </>
        )}

        {role === "user" && (
          <>
            <Link to="/my-tickets">My Tickets</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {role === "organiser" && (
          <>
            <Link to="/organiser-dashboard">Dashboard</Link>
            <Link to="/create-event">Create Event</Link>
            <Link to="/my-events">My Events</Link>
          </>
        )}

        {role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {user && (
          <>
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </div>

    {/* MOBILE MENU */}
    {open && (
      <div className="flex flex-col gap-4 mt-4 md:hidden text-center bg-slate-800 p-4 rounded">

        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {role === "user" && (
          <>
            <Link to="/my-tickets">My Tickets</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {role === "organiser" && (
          <>
            <Link to="/organiser-dashboard">Dashboard</Link>
            <Link to="/create-event">Create Event</Link>
            <Link to="/my-events">My Events</Link>
          </>
        )}

        {role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {user && (
          <>
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    )}

  </div>
)};
export default Navbar;
