import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // VALIDATION
    if (!form.name || !form.email || !form.password) {
      return toast.error("Please fill in all fields");
    }

    if (!form.email.includes("@")) {
      return toast.error("Please provide a valid email address");
    }

    if (form.password.length < 6) {
      return toast.error("Password is too short (min 6 characters)");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const res = await API.post("/api/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);

      toast.success("Welcome to EventX!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-indigo-100/50 p-8 w-full max-w-md">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-400 font-medium mt-1">Join the community & start booking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* NAME */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
            />
          </div>

          {/* PASSWORD */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 ml-1">Confirm</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : "Create Account"}
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already part of EventX?{" "}
            <Link to="/login" className="text-indigo-600 font-black hover:underline underline-offset-4">
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;