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
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-5 rounded">
          <h2>Total Events</h2>
          <p className="text-xl">{stats.events}</p>
        </div>
        <div className="bg-green-500 text-white p-5 rounded">
          <h2>Total Users</h2>
          <p className="text-xl">{stats.users}</p>
        </div>
        <div className="bg-purple-500 text-white p-5 rounded">
          <h2>Total Revenue</h2>
          <p className="text-xl font-bold">₹{stats.revenue}</p>
        </div>
      </div >


      <div className="mt-6">
        <BarChart width={400} height={300} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>

        <div className="flex flex-wrap gap-4 mt-5">
          <Link
            to="/admin-events"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Manage Events
          </Link>

          <Link
            to="/admin-users"
            className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
          >
            Users List
          </Link>

          <Link
            to="/admin-transactions"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Transactions
          </Link>
        </div>
        <h2 className="text-xl font-bold mb-3">Recent Transactions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : latestTransactions.length === 0 ? (
          <p>No transactions</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>

            <tbody>
              {latestTransactions.map((t) => (
                <tr key={t._id}>
                  <td className="p-2 border">{t.user?.name}</td>
                  <td className="p-2 border">₹{t.totalPrice}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white ${t.paymentStatus === "COMPLETED"
                          ? "bg-green-500"
                          : t.paymentStatus === "FAILED"
                            ? "bg-red-500"
                            : "bg-yellow-500"
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

        {/* LINK */}
        <div className="mt-3">
          <Link to="/admin-transactions" className="text-blue-600 underline">
            View All Transactions →
          </Link>
        </div>
      </div>
    </div>

  )
}

export default AdminDashboard
