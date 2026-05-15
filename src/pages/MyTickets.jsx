import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import PageLayout from "../components/PageLayout";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [emails, setEmails] = useState({});
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ===== FETCH TICKETS =====
  const fetchTickets = async () => {
    try {
      const res = await API.get("/api/tickets/my");
      setTickets(res.data.tickets || []);
    } catch (err) {
      toast.error("Failed to sync your ticket wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ===== CANCEL LOGIC =====
  const handleCancel = async (id, isPastEvent) => {
    if (isPastEvent) return toast.error("Cannot cancel tickets for past events");
    if (!window.confirm("Are you sure? This action cannot be undone and your seat will be released.")) return;

    try {
      setActionLoading(id);
      await API.delete(`/api/tickets/${id}`);
      toast.success("Ticket successfully cancelled");
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    } finally {
      setActionLoading(null);
    }
  };

  // ===== TRANSFER LOGIC =====
  const handleTransfer = async (id, isPastEvent) => {
    if (isPastEvent) return toast.error("Cannot transfer tickets for past events");
    
    const email = emails[id]?.trim();
    if (!email || !email.includes("@")) return toast.error("Please enter a valid recipient email");

    try {
      setActionLoading(id);
      await API.put(`/api/tickets/transfer/${id}`, { newUserEmail: email });
      toast.success("Ticket transferred successfully!");
      setEmails({ ...emails, [id]: "" });
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTickets = filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium">Opening your ticket wallet...</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">My Tickets</h1>
          <p className="text-gray-500 font-medium">View, transfer, or manage your event access.</p>
        </header>

        {/* STATS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Total Passes", val: tickets.length, color: "text-gray-900" },
            { label: "Active", val: tickets.filter(t => t.status === "BOOKED").length, color: "text-emerald-600" },
            { label: "Cancelled", val: tickets.filter(t => t.status === "CANCELLED").length, color: "text-rose-500" }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
              <span className={`text-2xl font-black ${stat.color}`}>{stat.val}</span>
            </div>
          ))}
        </div>

        {/* FILTER NAVIGATION */}
        <div className="flex items-center justify-center gap-2 mb-10 bg-gray-100/50 p-1.5 rounded-2xl w-fit mx-auto">
          {["ALL", "BOOKED", "CANCELLED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${
                filter === f ? "bg-white text-indigo-600 shadow-sm" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* TICKET LIST */}
        {filteredTickets.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">No tickets match your selection.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredTickets.map((t) => {
              const event = t.event;
              
              // Date checks to see if event has concluded
              const today = new Date();
              today.setHours(0,0,0,0);
              const eventDate = event?.date ? new Date(event.date) : null;
              if (eventDate) eventDate.setHours(0,0,0,0);
              const isPastEvent = eventDate ? eventDate < today : false;

              const statusColors = {
                BOOKED: isPastEvent ? "bg-gray-100 text-gray-600" : "bg-emerald-100 text-emerald-700",
                PENDING: "bg-amber-100 text-amber-700",
                CANCELLED: "bg-rose-100 text-rose-700"
              };

              return (
                <div key={t._id} className="relative bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-indigo-100/20 overflow-hidden flex flex-col lg:flex-row group transition-all hover:border-indigo-200">
                  
                  {/* TICKET IMAGE SECTION */}
                  <div className="relative w-full lg:w-72 h-48 lg:h-auto overflow-hidden">
                    <img
                      src={event?.images?.[0] ? `${import.meta.env.VITE_API_URL}/${event.images[0].replace(/^\/+/, "")}` : "/no-image.png"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt="Event"
                    />
                    <div className="absolute top-4 left-4">
                       <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm ${statusColors[t.status]}`}>
                        {t.status === "BOOKED" && isPastEvent ? "COMPLETED" : t.status}
                      </span>
                    </div>
                  </div>

                  {/* INFO SECTION */}
                  <div className="p-8 flex-1 flex flex-col justify-between relative">
                    <div className="hidden lg:block absolute left-[-12px] top-1/2 -translate-y-1/2 w-6 h-12 bg-[#f8fafc] border border-gray-100 rounded-full"></div>

                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{event?.title || "Unknown Event"}</h2>
                          <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                             <span>📅 {event?.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</span>
                             <span>📍 {event?.location || 'TBA'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase">Type</p>
                          <p className="font-bold text-indigo-600">{t.ticketType} (x{t.quantity})</p>
                        </div>
                      </div>
                    </div>

                    {t.status === "BOOKED" && (
                      <div className="mt-6 pt-6 border-t border-dashed border-gray-100 flex flex-col md:flex-row items-end gap-4">
                        {isPastEvent ? (
                          <div className="w-full text-center py-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-400 uppercase tracking-wider">
                            This event has concluded. Gate access is locked.
                          </div>
                        ) : (
                          <>
                            <div className="w-full flex-1">
                              <label className="text-[10px] font-black text-gray-400 uppercase mb-2 block ml-1">Transfer Seat</label>
                              <div className="flex gap-2">
                                <input
                                  type="email"
                                  placeholder="recipient@email.com"
                                  value={emails[t._id] || ""}
                                  onChange={(e) => setEmails({ ...emails, [t._id]: e.target.value })}
                                  className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                                />
                                <button
                                  disabled={!emails[t._id] || actionLoading === t._id}
                                  onClick={() => handleTransfer(t._id, isPastEvent)}
                                  className="px-6 py-2.5 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition disabled:opacity-30"
                                >
                                  {actionLoading === t._id ? "..." : "Send"}
                                </button>
                              </div>
                            </div>
                            
                            <button
                              disabled={actionLoading === t._id}
                              onClick={() => handleCancel(t._id, isPastEvent)}
                              className="w-full md:w-auto px-6 py-2.5 bg-rose-50 text-rose-500 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition disabled:opacity-30"
                            >
                              Cancel Booking
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* PSEUDO BARCODE AREA */}
                  <div className="hidden xl:flex w-24 bg-gray-50 items-center justify-center border-l border-dashed border-gray-200">
                    <div className="rotate-90 flex gap-1 opacity-20">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className={`h-12 ${i % 3 === 0 ? 'w-2' : 'w-1'} bg-black`}></div>
                      ))}
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

export default MyTickets;