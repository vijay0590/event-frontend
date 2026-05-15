import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import PageLayout from "../components/PageLayout";
import { useNavigate } from "react-router-dom";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const navigate = useNavigate();

  // ===== FETCH EVENTS =====
  const fetchEvents = async () => {
    try {
      const res = await API.get("/api/events");
      // Adjusted to handle various common API response structures
      const data = res.data.events || res.data || [];
      setEvents(data);
    } catch (err) {
      toast.error("Could not sync event database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ===== STATUS UPDATE (APPROVE/REJECT) =====
  const handleStatusUpdate = async (id, newStatus) => {
    if (actionLoading) return;
    try {
      setActionLoading(id);
      await API.put(`/api/events/admin/${id}/status`, { status: newStatus });
      
      toast.success(`Event ${newStatus.toLowerCase()} successfully`);
      
      // Update local state instead of full refetch for better UX
      setEvents(prev => prev.map(ev => 
        ev._id === id ? { ...ev, status: newStatus } : ev
      ));
    } catch (err) {
      toast.error("Failed to update event status.");
    } finally {
      setActionLoading(null);
    }
  };

  // ===== DELETE EVENT =====
  const handleDelete = async (id) => {
    if (!window.confirm("This will permanently remove the event and all associated ticket data. Continue?")) return;

    try {
      setActionLoading(id);
      await API.delete(`/api/events/${id}`);
      toast.success("Event purged from records.");
      setEvents(prev => prev.filter(ev => ev._id !== id));
    } catch (err) {
      toast.error("An error occurred during deletion.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Event Management</h1>
            <p className="text-gray-500">Monitor, edit, and moderate all platform listings.</p>
          </div>
          <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
             <span className="text-indigo-700 font-bold text-sm">{events.length} Total Events</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading event catalog...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium italic">The event catalog is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {events.map((e) => (
              <div key={e._id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* EVENT INFO */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-gray-900">{e.title}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      e.status === "APPROVED" ? "bg-green-100 text-green-700" : 
                      e.status === "REJECTED" ? "bg-red-100 text-red-700" : 
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {e.status || "PENDING"}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">📍 {e.location}</span>
                    <span className="flex items-center gap-1">📅 {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="text-indigo-600 font-medium">📂 {e.category}</span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2 flex-wrap">
                  {e.status === "PENDING" && (
                    <>
                      <button
                        disabled={actionLoading === e._id}
                        onClick={() => handleStatusUpdate(e._id, "APPROVED")}
                        className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        disabled={actionLoading === e._id}
                        onClick={() => handleStatusUpdate(e._id, "REJECTED")}
                        className="px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    disabled={actionLoading === e._id}
                    onClick={() => navigate(`/edit-event/${e._id}`)}
                    className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 border border-gray-100"
                    title="Edit Event"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>

                  <button
                    disabled={actionLoading === e._id}
                    onClick={() => handleDelete(e._id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition disabled:opacity-50 border border-red-100"
                    title="Delete Event"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminEvents;