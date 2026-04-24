import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/api/admin/transactions")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.log(err));
  }, []);

  const filtered = transactions.filter((t) =>
    t.user?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        All Transactions
      </h1>

      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search by user..."
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-200 px-4 py-2 rounded-lg w-full md:w-1/3 mb-5 focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      {/* TABLE */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="text-left text-gray-500 border-b bg-gray-50">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Event</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment ID</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => (
                <tr key={t._id} className="border-b hover:bg-gray-50">

                  <td className="p-3 font-medium text-gray-900">
                    {t.user?.name || "Unknown"}
                  </td>

                  <td className="p-3 text-gray-600">
                    {t.event?.title || "-"}
                  </td>

                  <td className="p-3 text-gray-900">
                    ₹{t.totalPrice}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${t.paymentStatus === "COMPLETED"
                        ? "bg-green-100 text-green-600"
                        : t.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                      {t.paymentStatus}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500">
                    {t.paymentId}
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

    </div>
  );
};

export default AdminTransactions;