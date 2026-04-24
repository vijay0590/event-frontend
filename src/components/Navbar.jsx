import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null);
    navigate("/login");
  };
  const role = (user?.role || user?.accountType)?.toLowerCase();
  const activeClass = (path) => {
    return location.pathname === path
      ? "text-indigo-600 font-semibold" : ""
  }

  return (
    <div className="bg-white/70 backdrop-blur-md border-b border-indigo-100/60 px-6 py-3 sticky top-0 z-50">

      <div className="flex justify-between items-center max-w-7xl mx-auto w-full">

        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-1.5 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"
              />
            </svg>
          </div>

          <span className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition">
            EventX
          </span>
        </div>
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
              <Link to="/my-tickets"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/my-tickets")}`}
              >My Tickets</Link>
              <Link to="/profile"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/profile")}`}
              >Profile</Link>
            </>
          )}

          {role === "organiser" && (
            <>
              <Link to="/organiser-dashboard"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/organiser-dashboard")}`}
              >Dashboard</Link>
              <Link to="/create-event"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/create-event")}`}
              >Create Event</Link>
              <Link to="/my-events"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/my-events")}`}
              >My Events</Link>
            </>
          )}

          {role === "admin" && (
            <Link to="/admin"
              className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/admin")}`}
            >Admin</Link>
          )}

          {user && (
            <>
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>

      {/* MOBILE MENU */}

      {open && (
        <div className="flex flex-col gap-4 mt-4 md:hidden text-center bg-white border p-4 rounded-lg shadow">
          <Link to="/" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/")}`}>Home</Link>

          {!user && (
            <>
              <Link to="/login" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/login")}`}>Login</Link>
              <Link to="/register" className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/register")}`}>Register</Link>
            </>
          )}

          {role === "user" && (
            <>
              <Link to="/my-tickets"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/my-tickets")}`}
              >My Tickets</Link>
              <Link to="/profile"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/profile")}`}
              >Profile</Link>
            </>
          )}

          {role === "organiser" && (
            <>
              <Link to="/organiser-dashboard"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/organiser-dashboard")}`}
              >Dashboard</Link>
              <Link to="/create-event"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/create-event")}`}
              >Create Event</Link>
              <Link to="/my-events"
                className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/my-events")}`}
              >My Events</Link>
            </>
          )}

          {role === "admin" && (
            <Link to="/admin"
              className={`text-gray-600 hover:text-indigo-600 transition ${activeClass("/admin")}`}
            >Admin</Link>
          )}

          {user && (
            <>
              <span>{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

    </div>
  )
};
export default Navbar;
