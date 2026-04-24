import { useState, useEffect } from "react"
import API from "../api/axios"
import { Link } from "react-router-dom";
import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";




const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    events: 0,
    revenue: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const latestTransactions = transactions.slice(0, 5);

  useEffect(() => {
    API.get("/api/admin")
      .then((res) => setStats({
        users: res.data.users,
        events: res.data.events,
        revenue: res.data.revenue
      }))
      .catch((err) => console.log(err))
    //transactions
    API.get("/api/admin/transactions")
      .then((res) => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [])
  const data = [
    { name: "Events", value: stats.events },
    { name: "Users", value: stats.users },

  ]


  return (
  <div className="max-w-6xl mx-auto px-4 py-10">

    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
      Admin Dashboard
    </h1>

    {/* 🔥 STATS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Events</p>
        <h2 className="text-2xl font-semibold text-gray-900">
          {stats.events}
        </h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Users</p>
        <h2 className="text-2xl font-semibold text-gray-900">
          {stats.users}
        </h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-gray-500">Total Revenue</p>
        <h2 className="text-2xl font-semibold text-indigo-600">
          ₹{stats.revenue}
        </h2>
      </div>

    </div>

    {/* 📊 CHART */}
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-8">

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Overview
      </h2>

      <div className="w-full overflow-x-auto">
        <BarChart width={500} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>

    </div>

    {/* ⚡ ACTIONS */}
    <div className="flex flex-wrap gap-3 mt-6">

      <Link
        to="/admin-events"
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
      >
        Manage Events
      </Link>

      <Link
        to="/admin-users"
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
      >
        Users
      </Link>

      <Link
        to="/admin-transactions"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
      >
        Transactions
      </Link>

    </div>

    {/* 💳 TRANSACTIONS */}
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mt-8">

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Transactions
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : latestTransactions.length === 0 ? (
        <p className="text-gray-500">No transactions</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="text-left text-gray-500 border-b">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {latestTransactions.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50">

                  <td className="p-2">
                    {t.user?.name || "Unknown"}
                  </td>

                  <td className="p-2">
                    ₹{t.totalPrice}
                  </td>

                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        t.paymentStatus === "COMPLETED"
                          ? "bg-green-100 text-green-600"
                          : t.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-600"
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
        </div>
      )}

      <div className="mt-3">
        <Link
          to="/admin-transactions"
          className="text-indigo-600 text-sm hover:underline"
        >
          View all →
        </Link>
      </div>

    </div>

  </div>
);
}

export default AdminDashboard
