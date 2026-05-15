import { useContext, useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import PageLayout from "../components/PageLayout";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", email: "" });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0,
    pending: 0,
  });

  const [loadingStats, setLoadingStats] = useState(true);
  const [saving, setSaving] = useState(false);

  // ===== SYNC FORM =====
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // ===== FETCH & DYNAMICALLY PARSE STATS =====
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/api/tickets/my");
        const tickets = res.data?.tickets || []; // Safely target the ticket array payload

        // DYNAMIC DERIVATIVE CALCULATION
        setStats({
          total: tickets.length,
          active: tickets.filter((t) => t.status === "BOOKED").length,
          cancelled: tickets.filter((t) => t.status === "CANCELLED").length,
          pending: tickets.filter((t) => t.status === "PENDING").length,
        });
      } catch (err) {
        toast.error("Could not sync ticket analytics");
      } finally {
        setLoadingStats(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===== UPDATE PROFILE =====
  const handleUpdate = async () => {
    if (saving) return;

    if (!form.name || !form.email) return toast.error("Required fields are empty");
    if (!form.email.includes("@")) return toast.error("Invalid email format");
    
    // No-op if nothing changed
    if (form.name === user.name && form.email === user.email) {
      return toast("Your profile is already up to date");
    }

    try {
      setSaving(true);
      const res = await API.put("/api/users/me", form);
      
      const updatedUser = res.data.user || { ...user, ...form };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Identity updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Cloud sync failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Authenticating...</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/30 border border-gray-100 overflow-hidden">
          
          {/* TOP DECORATIVE BAR */}
          <div className="h-32 bg-indigo-600 relative">
            <div className="absolute -bottom-12 left-10">
              <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl font-black text-indigo-600 border-2 border-indigo-100">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 px-10 pb-10">
            {/* USER INFO HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{user.name}</h2>
                <p className="text-gray-500 font-medium">{user.email}</p>
                <div className="mt-3">
                   <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    {user.role || 'Member'}
                  </span>
                </div>
              </div>
            </div>

            {/* STATS ANALYTICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { label: "Total", val: stats.total, style: "bg-gray-50 text-gray-900" },
                { label: "Active", val: stats.active, style: "bg-emerald-50 text-emerald-600" },
                { label: "Pending", val: stats.pending, style: "bg-amber-50 text-amber-600" },
                { label: "Cancelled", val: stats.cancelled, style: "bg-rose-50 text-rose-600" }
              ].map((stat, i) => (
                <div key={i} className={`${stat.style} p-5 rounded-3xl border border-white/50 text-center shadow-sm`}>
                  <p className="text-2xl font-black">{loadingStats ? "..." : stat.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* FORM SETTINGS */}
            <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Account Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? "Updating Cloud..." : "Sync Profile Changes"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;