import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

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
    // 🔥 STATS
    API.get("/api/admin")
      .then((res) =>
        setStats({
          users: res.data.users,
          events: res.data.events,
          revenue: res.data.revenue,
        })
      )
      .catch((err) => console.log(err));

    // 💳 TRANSACTIONS
    API.get("/api/admin/transactions")
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));

    // ⚡ PENDING EVENTS
    API.get("/api/events/admin/pending")
      .then((res) => setPendingEvents(res.data.events))
      .catch((err) => console.log(err));
  }, []);

  // ✅ APPROVE EVENT
  const handleApprove = async (id) => {
    try {
      await API.put(`/api/events/admin/${id}/status`, {
        status: "APPROVED",
      });
      setPendingEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ REJECT EVENT
  const handleReject = async (id) => {
    try {
      await API.put(`/api/events/admin/${id}/status`, {
        status: "REJECTED",
      });
      setPendingEvents((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const data = [
    { name: "Events", value: stats.events },
    { name: "Users", value: stats.users },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Admin Dashboard
      </h1>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Events</p>
          <h2 className="text-2xl font-semibold">{stats.events}</h2>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <h2 className="text-2xl font-semibold">{stats.users}</h2>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-2xl font-semibold text-indigo-600">
            ₹{stats.revenue}
          </h2>
        </div>

      </div>

      {/* 📊 CHART */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm mt-8">

        <h2 className="text-lg font-semibold mb-4">Overview</h2>

        <BarChart width={500} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>

      </div>

      {/* ⚡ PENDING EVENTS */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm mt-8">

        <h2 className="text-lg font-semibold mb-4">
          Pending Events
        </h2>

        {pendingEvents.length === 0 ? (
          <p className="text-gray-500">No pending events</p>
        ) : (
          pendingEvents.map((e) => (
            <div key={e._id} className="border p-4 mb-3 rounded-lg">

              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-500">
                {e.organiser?.name}
              </p>

              <div className="flex gap-3 mt-3">

                <button
                  onClick={() => handleApprove(e._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(e._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>

              </div>

            </div>
          ))
        )}

      </div>

      {/* ⚡ ACTIONS */}
      <div className="flex gap-3 mt-6 flex-wrap">

        <Link to="/admin-events" className="px-4 py-2 bg-gray-100 rounded">
          Manage Events
        </Link>

        <Link to="/admin-users" className="px-4 py-2 bg-gray-100 rounded">
          Users
        </Link>

        <Link to="/admin-transactions" className="px-4 py-2 bg-indigo-600 text-white rounded">
          Transactions
        </Link>

      </div>

      {/* 💳 TRANSACTIONS */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm mt-8">

        <h2 className="text-lg font-semibold mb-4">
          Recent Transactions
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : latestTransactions.length === 0 ? (
          <p>No transactions</p>
        ) : (
          <table className="w-full text-sm">

            <thead>
              <tr>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {latestTransactions.map((t) => (
                <tr key={t._id}>

                  <td>{t.user?.name || "Unknown"}</td>

                  <td>₹{t.totalPrice}</td>

                  <td>{t.paymentStatus}</td>

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