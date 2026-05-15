import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { BarChart, XAxis, YAxis, Tooltip, Bar, ResponsiveContainer, CartesianGrid } from "recharts";
import toast from "react-hot-toast";
import PageLayout from "../components/PageLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, events: 0, revenue: 0 });
  const [transactions, setTransactions] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const latestTransactions = transactions.slice(0, 5);

  // ===== FETCH DATA =====
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, txRes, pendingRes] = await Promise.all([
          API.get("/api/admin"),
          API.get("/api/admin/transactions"),
          API.get("/api/events/admin/pending")
        ]);

        setStats({
          users: statsRes.data?.users || 0,
          events: statsRes.data?.events || 0,
          revenue: statsRes.data?.revenue || 0,
        });
        setTransactions(txRes.data || []);
        setPendingEvents(pendingRes.data.events || []);
      } catch (err) {
        toast.error("Failed to sync admin records");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ===== EVENT ACTIONS =====
  const handleUpdateStatus = async (id, status) => {
    if (actionLoading) return;
    try {
      setActionLoading(id);
      await API.put(`/api/events/admin/${id}/status`, { status });
      toast.success(`Event ${status.toLowerCase()} successfully`);
      setPendingEvents((prev) => prev.filter((e) => e._id !== id));
      // Refresh stats after approval
      if (status === "APPROVED") setStats(s => ({ ...s, events: s.events + 1 }));
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const chartData = [
    { name: "Live Events", value: stats.events },
    { name: "Total Users", value: stats.users },
    { name: "Pending", value: pendingEvents.length },
  ];

  if (loading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Securing Dashboard Access...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">System Control</h1>
            <p className="text-gray-500">Overview of platform health and ticket economy.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/admin-events" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">Events</Link>
            <Link to="/admin-users" className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">Users</Link>
          </div>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg></div>
             <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">Platform Users</p>
             <h2 className="text-4xl font-black text-gray-900">{stats.users.toLocaleString()}</h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10"><svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" /></svg></div>
             <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mb-1">Live Events</p>
             <h2 className="text-4xl font-black text-gray-900">{stats.events.toLocaleString()}</h2>
          </div>

          <div className="bg-indigo-600 p-8 rounded-3xl shadow-xl shadow-indigo-100 relative overflow-hidden">
             <p className="text-indigo-200 font-bold uppercase text-xs tracking-widest mb-1">Total Revenue</p>
             <h2 className="text-4xl font-black text-white">₹{stats.revenue.toLocaleString('en-IN')}</h2>
             
             {/* FIXED COPY: Adjusted from real-time to reflect static local state mapping */}
             <div className="mt-2 text-indigo-300 text-xs font-medium flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
               Aggregated payment gateways snapshot
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* ANALYTICS CHART */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-5 bg-indigo-600 rounded-full"></span> Platform Growth
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PENDING APPROVALS */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-2 h-5 bg-yellow-400 rounded-full"></span> Queue ({pendingEvents.length})
            </h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {pendingEvents.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-400 font-medium italic underline underline-offset-4 decoration-green-300">All caught up!</p>
                </div>
              ) : (
                pendingEvents.map((e) => (
                  <div key={e._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group transition hover:bg-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{e.title}</h3>
                      <p className="text-xs text-gray-500 font-medium">By: {e.organiser?.name || "Independent"}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(e._id, "APPROVED")}
                        className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-600 hover:text-white transition"
                      >
                        Approve
                      </button>
                      <button 
                         onClick={() => handleUpdateStatus(e._id, "REJECTED")}
                         className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition"
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="mt-10 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
             <Link to="/admin-transactions" className="text-indigo-600 text-sm font-bold hover:underline">View All &rarr;</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">User</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4 text-right">Transaction ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {latestTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-8 py-4">
                        <p className="font-bold text-gray-800">{t.user?.name || "Guest"}</p>
                        <p className="text-xs text-gray-400">{t.user?.email}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-tighter ${
                        t.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {t.paymentStatus || "PENDING"}
                      </span>
                    </td>
                    <td className="px-8 py-4 font-mono font-bold text-gray-900">₹{t.totalPrice}</td>
                    <td className="px-8 py-4 text-right font-mono text-xs text-gray-400">#{t._id.slice(-8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;