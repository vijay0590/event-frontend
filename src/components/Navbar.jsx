import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const role = (user?.role || user?.accountType)?.toLowerCase();

  const activeClass = (path) => {
    return location.pathname === path
      ? "text-indigo-600 font-semibold"
      : "";
  };

  // Prevent background scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <div className="bg-white/70 backdrop-blur-md border-b border-indigo-100/60 px-6 py-3 sticky top-0 z-50">

      {/* TOP NAV */}
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full">

        {/* MENU BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <span className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
            EventX
          </span>
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 items-center text-sm font-medium">

          <Link to="/" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/")}`}>Home</Link>

          {!user && (
            <>
              <Link to="/login" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/login")}`}>Login</Link>
              <Link to="/register" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/register")}`}>Register</Link>
            </>
          )}

          {role === "user" && (
            <>
              <Link to="/my-tickets" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/my-tickets")}`}>My Tickets</Link>
              <Link to="/profile" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/profile")}`}>Profile</Link>
            </>
          )}

          {role === "organiser" && (
            <>
              <Link to="/organiser-dashboard" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/organiser-dashboard")}`}>Dashboard</Link>
              <Link to="/create-event" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/create-event")}`}>Create Event</Link>
              <Link to="/my-events" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/my-events")}`}>My Events</Link>
            </>
          )}

          {role === "admin" && (
            <Link to="/admin" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/admin")}`}>Admin</Link>
          )}

          {user && (
            <>
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-500 transition">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setOpen(false)}
          ></div>

          {/* MENU */}
          <div className="fixed top-0 left-0 w-full h-screen bg-white z-50 flex flex-col items-center justify-center gap-6 text-lg md:hidden">

            {/* CLOSE BUTTON */}
            <button
              className="absolute top-4 right-6 text-2xl"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

            <Link to="/" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/")}`}>Home</Link>

            {!user && (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/login")}`}>Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/register")}`}>Register</Link>
              </>
            )}

            {role === "user" && (
              <>
                <Link to="/my-tickets" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/my-tickets")}`}>My Tickets</Link>
                <Link to="/profile" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/profile")}`}>Profile</Link>
              </>
            )}

            {role === "organiser" && (
              <>
                <Link to="/organiser-dashboard" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/organiser-dashboard")}`}>Dashboard</Link>
                <Link to="/create-event" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/create-event")}`}>Create Event</Link>
                <Link to="/my-events" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/my-events")}`}>My Events</Link>
              </>
            )}

            {role === "admin" && (
              <Link to="/admin" onClick={() => setOpen(false)} className={`text-gray-600 hover:text-indigo-600 ${activeClass("/admin")}`}>Admin</Link>
            )}

            {user && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <span className="text-gray-800 font-semibold">{user.name}</span>

                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}

          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;