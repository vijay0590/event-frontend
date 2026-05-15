import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  // ===== FETCH EVENTS =====
  const fetchEvents = async () => {
    try {
      const res = await API.get("/api/events/me/");
      setEvents(res.data.events || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Connection to event server failed");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ===== DELETE HANDLER =====
  const handleDelete = async (id) => {
    if (!window.confirm("Danger: This will cancel the event and notify attendees. Proceed?")) return;

    try {
      setActionLoading(id);
      await API.delete(`/api/events/${id}`);
      toast.success("Event permanently removed");
      setEvents(prev => prev.filter(e => e._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Protocol failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Organizer Hub</h1>
            <p className="text-gray-500 font-medium">Manage and monitor your hosted experiences.</p>
          </div>
          <button 
            onClick={() => navigate("/create-event")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Host New Event
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Retrieving your portfolio...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <div className="text-5xl mb-4">🎫</div>
            <h3 className="text-xl font-bold text-gray-800">Your stage is empty</h3>
            <p className="text-gray-500 mb-6">You haven't created any events yet.</p>
            <button 
              onClick={() => navigate("/create-event")}
              className="text-indigo-600 font-black hover:underline"
            >
              Launch your first event &rarr;
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {events.map((e) => {
              const isPast = new Date(e.date) < new Date();
              
              return (
                <div
                  key={e._id}
                  className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    {/* INFO */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          isPast ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'
                        }`}>
                          {isPast ? "Past Event" : "Live / Upcoming"}
                        </span>
                        <span className="text-xs text-indigo-500 font-bold">
                          {e.category || "General"}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition">
                        {e.title}
                      </h2>
                      
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                          <span className="text-indigo-400 font-bold">📍</span> {e.location}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                          <span className="text-indigo-400 font-bold">📅</span> {new Date(e.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
                      <Link
                        to={`/attendees/${e._id}`}
                        className="flex-1 md:flex-none text-center text-xs font-black uppercase tracking-tighter px-4 py-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 transition"
                      >
                        Guest List
                      </Link>

                      <button
                        onClick={() => navigate(`/edit-event/${e._id}`)}
                        className="flex-1 md:flex-none text-xs font-black uppercase tracking-tighter px-4 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                      >
                        Edit
                      </button>

                      <button
                        disabled={actionLoading === e._id}
                        onClick={() => handleDelete(e._id)}
                        className="flex-1 md:flex-none text-xs font-black uppercase tracking-tighter px-4 py-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                      >
                        {actionLoading === e._id ? "..." : "Cancel"}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default MyEvents;