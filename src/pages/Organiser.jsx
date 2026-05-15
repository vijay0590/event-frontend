import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const Organiser = () => {
  const [stats, setStats] = useState({
    events: 0,
    tickets: 0,
    revenue: 0,
  });

  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          API.get("/api/analytics/overall"),
          await API.get("/api/events/me?limit=5"), // Bumped to 5 for a fuller list
        ]);

        setStats({
          events: statsRes.data?.totalEvents || 0,
          tickets: statsRes.data?.totalTickets || 0,
          revenue: statsRes.data?.totalRevenue || 0,
        });

        setRecentEvents(eventsRes.data?.events || []);
      } catch (err) {
        toast.error("Dashboard sync failed. Check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Aggregating Data...</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* HEADER & QUICK ACTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Executive Summary</h1>
            <p className="text-gray-500 font-medium mt-2">Here's how your EventX portfolio is performing.</p>
          </div>
          <button 
            onClick={() => navigate("/create-event")}
            className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95"
          >
            + Create New Experience
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            { label: "Active Events", val: stats.events, icon: "📅", color: "from-blue-50 to-indigo-50 text-indigo-700" },
            { label: "Tickets Sold", val: stats.tickets, icon: "🎟️", color: "from-emerald-50 to-teal-50 text-emerald-700" },
            { label: "Net Revenue", val: `₹${Number(stats.revenue).toLocaleString("en-IN")}`, icon: "💰", color: "from-orange-50 to-amber-50 text-orange-700" }
          ].map((item, i) => (
            <div key={i} className={`bg-gradient-to-br ${item.color} p-8 rounded-[2.5rem] border border-white shadow-sm`}>
              <div className="text-2xl mb-4">{item.icon}</div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{item.label}</p>
              <h2 className="text-3xl font-black tracking-tight">{item.val}</h2>
            </div>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* RECENT ACTIVITY */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-gray-900">Recent Listings</h2>
              <button onClick={() => navigate("/my-events")} className="text-xs font-black text-indigo-600 hover:underline">View All</button>
            </div>

            {recentEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 italic">No activity recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentEvents.map((e) => (
                  <div
                    key={e._id}
                    onClick={() => navigate(`/edit-event/${e._id}`)}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-xl">
                        {e.category === "Music" ? "🎸" : e.category === "Tech" ? "💻" : "✨"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{e.title}</p>
                        <p className="text-xs text-gray-400 font-medium">
                          {e.date ? new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Date TBA"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-lg text-gray-500">
                      {e.category || "General"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDEBAR TIPS / MINI STATS */}
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-lg font-black mb-4">Organiser Tip 💡</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Events with high-quality images see 40% more ticket conversions. Make sure your cover photo is eye-catching!
            </p>
            <div className="pt-6 border-t border-indigo-500/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold opacity-80">Profile Strength</span>
                <span className="text-xs font-black">85%</span>
              </div>
              <div className="w-full bg-indigo-800 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full w-[85%]"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </PageLayout>
  );
};

export default Organiser;