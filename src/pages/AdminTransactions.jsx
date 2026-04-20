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
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">All Transactions</h1>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search user..."
        className="border p-2 mb-4 w-full md:w-1/3"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Event</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Payment ID</th>
              <th className="p-2 border">Date</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t._id}>
                <td className="p-2 border">{t.user?.name}</td>
                <td className="p-2 border">{t.event?.title}</td>
                <td className="p-2 border">₹{t.totalPrice}</td>

                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 text-white rounded ${
                      t.paymentStatus === "COMPLETED"
                        ? "bg-green-500"
                        : t.paymentStatus === "FAILED"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {t.paymentStatus}
                  </span>
                </td>

                <td className="p-2 border">{t.paymentId}</td>
                <td className="p-2 border">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;