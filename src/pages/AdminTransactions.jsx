import { useEffect, useState } from "react";
import API from "../api/axios";
import PageLayout from "../components/PageLayout";
import toast from "react-hot-toast";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/api/admin/transactions");
        setTransactions(res.data || []);
      } catch (err) {
        toast.error("Audit log sync failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // ===== FILTER LOGIC =====
  const filtered = transactions.filter((t) => {
    const userName = t.user?.name?.toLowerCase() || "";
    const eventName = t.event?.title?.toLowerCase() || "";
    const query = search.toLowerCase();
    // Allow searching by both user name and event title
    return userName.includes(query) || eventName.includes(query);
  });

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Audit Ledger</h1>
          <p className="text-gray-500">Comprehensive history of all platform financial movements.</p>
        </header>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input
              type="text"
              placeholder="Search by user or event..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl w-full focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
            />
          </div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            {filtered.length} Records Found
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium tracking-tight">Accessing encrypted logs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <p className="text-gray-400 font-medium">No matching transactions in our history.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Participant</th>
                    <th className="px-6 py-4">Target Event</th>
                    <th className="px-6 py-4">Total Value</th>
                    <th className="px-6 py-4">Payment Health</th>
                    <th className="px-6 py-4">Reference ID</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filtered.map((t) => (
                    <tr key={t._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{t.user?.name || "Anonymous"}</p>
                        <p className="text-xs text-gray-400">{t.user?.email || "No contact info"}</p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 font-medium line-clamp-1">{t.event?.title || "Deleted Event"}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-black text-gray-900 text-base">
                          ₹{t.totalPrice?.toLocaleString('en-IN') || 0}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                          t.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" : 
                          t.paymentStatus === "FAILED" ? "bg-red-100 text-red-700" : 
                          "bg-orange-100 text-orange-700"
                        }`}>
                          {t.paymentStatus || "PENDING"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-mono text-[11px] text-gray-400 select-all">
                          {t.paymentId || "INTERNAL_TX"}
                        </p>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-xs text-gray-500 font-medium">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-GB') : "-"}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase">
                          {t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </p>
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

export default AdminTransactions;