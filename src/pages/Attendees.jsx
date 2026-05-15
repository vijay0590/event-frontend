import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import PageLayout from "../components/PageLayout";
import toast from "react-hot-toast";

const Attendees = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/api/events/${id}/attendees`);
        
        // Safety: Extract the array regardless of backend structure
        const data = res.data?.attendees || res.data || [];
        setAttendees(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Failed to fetch guest list");
        setAttendees([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAttendees();
  }, [id]);

  // ===== EXPORT CSV =====
  const handleExport = async () => {
    if (exporting || attendees.length === 0) return;
    try {
      setExporting(true);
      const res = await API.get(`/api/events/${id}/attendees/export`, { 
        responseType: "blob" 
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.href = url;
      link.setAttribute("download", `event_${id}_guests.csv`);
      document.body.appendChild(link);
      link.click();
      
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Guest list exported ✨");
    } catch (err) {
      toast.error("Export failed. Ensure backend route exists.");
    } finally {
      setExporting(false);
    }
  };

  // Local Filter Logic (Safe against null values)
  const filteredAttendees = attendees.filter(a => {
    const name = (a.name || a.user?.name || "").toLowerCase();
    const email = (a.email || a.user?.email || "").toLowerCase();
    const term = search.toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  const totalTickets = attendees.reduce((sum, a) => sum + (a.quantity || a.tickets || 1), 0);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="text-indigo-600 font-bold text-sm mb-2 flex items-center gap-1 hover:underline"
            >
              &larr; Back
            </button>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Attendee List</h1>
            <p className="text-gray-500 font-medium">Manage guests and verified ticket holders.</p>
          </div>

          <button
            onClick={handleExport}
            disabled={exporting || attendees.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {exporting ? "Generating..." : "Export CSV"}
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100">
            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Total Guests</p>
            <p className="text-3xl font-black">{attendees.length}</p>
          </div>
          <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Tickets Issued</p>
            <p className="text-3xl font-black text-gray-800">{totalTickets}</p>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-5 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
          />
        </div>

        {/* TABLE SECTION */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium tracking-tight">Fetching guest database...</p>
          </div>
        ) : filteredAttendees.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">
              {search ? "No matches found for your search." : "No one has registered for this event yet."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5">Guest Name</th>
                    <th className="px-8 py-5">Contact</th>
                    <th className="px-8 py-5">Qty</th>
                    <th className="px-8 py-5 text-right">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredAttendees.map((a, index) => (
                    <tr key={a._id || index} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="px-8 py-5 font-bold text-gray-800">
                        {a.name || a.user?.name || "Guest User"}
                      </td>
                      <td className="px-8 py-5 text-gray-500 font-medium">
                        {a.email || a.user?.email || "N/A"}
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">
                          {a.quantity || a.tickets || 1}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                           <span className="text-[10px] font-black uppercase tracking-tight">
                             {a.status || "Confirmed"}
                           </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Attendees;