import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    revenue: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const latestTransactions = transactions.slice(0, 5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await API.get("/api/admin");
        setStats({
          users: statsRes.data.users,
          events: statsRes.data.events,
          revenue: statsRes.data.revenue,
        });

        const txRes = await API.get("/api/admin/transactions");
        setTransactions(txRes.data);

        const pendingRes = await API.get("/api/events/admin/pending");
        setPendingEvents(pendingRes.data.events);

      } catch (err) {
        console.log(err);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // APPROVE
  const handleApprove = async (id) => {
    try {
      await API.put(`/api/events/admin/${id}/status`, {
        status: "APPROVED",
      });
      toast.success("Event approved");
      setPendingEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error("Approval failed");
    }
  };

  // REJECT
  const handleReject = async (id) => {
    try {
      await API.put(`/api/events/admin/${id}/status`, {
        status: "REJECTED",
      });
      toast.success("Event rejected");
      setPendingEvents((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error("Rejection failed");
    }
  };

  const data = [
    { name: "Events", value: stats.events },
    { name: "Users", value: stats.users },
  ];

  // LOADING UI
  if (loading) {
    return <p className="text-center mt-10">Loading admin data...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total Events</p>
          <h2 className="text-2xl font-semibold">{stats.events}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-semibold">{stats.users}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-2xl font-semibold text-indigo-600">
            ₹{stats.revenue}
          </h2>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>

        <div className="w-full overflow-x-auto">
          <BarChart width={600} height={300} data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </div>
      </div>

      {/* PENDING EVENTS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
        <h2 className="text-lg font-semibold mb-4">
          Pending Events
        </h2>

        {pendingEvents.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No pending events 🎉
          </p>
        ) : (
          pendingEvents.map((e) => (
            <div key={e._id} className="bg-gray-50 p-4 rounded-xl mb-3">

              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-500">
                {e.organiser?.name || "Unknown"}
              </p>

              <div className="flex gap-3 mt-3">

                <button
                  onClick={() => handleApprove(e._id)}
                  className="px-3 py-1 rounded-lg bg-green-500 text-white hover:bg-green-600 text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(e._id)}
                  className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm"
                >
                  Reject
                </button>

              </div>

            </div>
          ))
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 mt-6 flex-wrap">

        <Link
          to="/admin-events"
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
        >
          Manage Events
        </Link>

        <Link
          to="/admin-users"
          className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium"
        >
          Users
        </Link>

        <Link
          to="/admin-transactions"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium"
        >
          Transactions
        </Link>

      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">

        <h2 className="text-lg font-semibold mb-4">
          Recent Transactions
        </h2>

        {latestTransactions.length === 0 ? (
          <p className="text-gray-500">No transactions</p>
        ) : (
          <table className="w-full text-sm border-separate border-spacing-y-2">

            <thead className="text-left text-gray-500">
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {latestTransactions.map((t) => (
                <tr key={t._id} className="bg-gray-50">

                  <td className="p-3 rounded-l-xl">
                    {t.user?.name || "Unknown"}
                  </td>

                  <td className="p-3">₹{t.totalPrice}</td>

                  <td className="p-3 rounded-r-xl">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.paymentStatus === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {t.paymentStatus}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
};

export default AdminDashboard;