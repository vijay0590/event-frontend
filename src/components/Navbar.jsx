import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const role = (user?.role || user?.accountType || "").toLowerCase();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
    setOpen(false);
  };

  const activeClass = (path) => {
    const isActive = path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(path);
    
    return isActive 
      ? "text-indigo-600 font-bold" 
      : "text-gray-600 hover:text-indigo-500 transition-colors";
  };

  // Auto-close mobile menu on resize or navigation
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-[100] px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO SECTION */}
        <div 
          onClick={() => navigate("/")} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
            <span className="text-xl font-black">X</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900">
            EVENT<span className="text-indigo-600">X</span>
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-8 text-[13px] font-black uppercase tracking-widest">
          <Link to="/" className={activeClass("/")}>Home</Link>

          {!user ? (
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-gray-900">Sign In</Link>
              <Link 
                to="/register" 
                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-600 transition-all shadow-md"
              >
                Join Now
              </Link>
            </div>
          ) : (
            <>
              {role === "user" && (
                <>
                  <Link to="/my-tickets" className={activeClass("/my-tickets")}>Tickets</Link>
                  <Link to="/profile" className={activeClass("/profile")}>Profile</Link>
                </>
              )}

              {role === "organiser" && (
                <>
                  <Link to="/organiser-dashboard" className={activeClass("/organiser-dashboard")}>Dashboard</Link>
                  <Link to="/create-event" className={activeClass("/create-event")}>Create</Link>
                  <Link to="/my-events" className={activeClass("/my-events")}>My Events</Link>
                </>
              )}

              {role === "admin" && (
                <Link to="/admin" className={activeClass("/admin")}>Admin Panel</Link>
              )}

              <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 leading-none mb-1">{role}</p>
                  <p className="text-gray-900 normal-case tracking-normal font-bold">{user.name.split(' ')[0]}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                  title="Logout"
                >
                  <span className="text-lg">⏻</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* MOBILE BURGER */}
        <button 
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setOpen(true)}
        >
          <div className="w-6 h-0.5 bg-gray-900 rounded-full"></div>
          <div className="w-6 h-0.5 bg-indigo-600 rounded-full"></div>
          <div className="w-4 h-0.5 bg-gray-900 rounded-full self-end"></div>
        </button>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <div className={`fixed inset-0 bg-gray-900/95 z-[200] transition-all duration-500 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button 
          className="absolute top-8 right-8 text-white text-3xl font-light"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>

        <div className="flex flex-col h-full justify-center items-center gap-8 text-white text-2xl font-black uppercase tracking-tighter">
          <Link onClick={() => setOpen(false)} to="/">Home</Link>
          
          {user ? (
            <>
              {role === "user" && <Link to="/my-tickets">My Tickets</Link>}
              {role === "organiser" && <Link to="/organiser-dashboard">Dashboard</Link>}
              {role === "admin" && <Link to="/admin">Admin</Link>}
              
              <Link to="/profile" className="text-indigo-400">Profile Settings</Link>
              
              <button 
                onClick={handleLogout}
                className="mt-10 px-8 py-3 bg-rose-600 rounded-2xl text-sm"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register" className="text-indigo-400">Join EventX</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;