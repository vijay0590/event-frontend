import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [emails, setEmails] = useState({});
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    try {
      const res = await API.get("/api/tickets/my");
      setTickets(res.data.tickets);
    } catch (err) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.delete(`/api/tickets/${id}`);
      toast.success("Ticket cancelled");
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  const handleTransfer = async (id) => {
    try {
      await API.put(`/api/tickets/transfer/${id}`, {
        newUserEmail: emails[id],
      });
      toast.success("Ticket transferred");
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Transfer failed");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ✅ FILTER LOGIC
  const filteredTickets =
    filter === "ALL"
      ? tickets
      : tickets.filter((t) => t.status === filter);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <BackButton />

      <h1 className="text-3xl font-bold text-center mb-6">
        My Tickets
      </h1>

      {/* 🔥 SUMMARY */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-sm text-gray-500">Total</p>
          <h2 className="text-lg font-semibold">{tickets.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-sm text-gray-500">Booked</p>
          <h2 className="text-green-600 font-semibold">
            {tickets.filter(t => t.status === "BOOKED").length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-sm text-gray-500">Cancelled</p>
          <h2 className="text-red-600 font-semibold">
            {tickets.filter(t => t.status === "CANCELLED").length}
          </h2>
        </div>
      </div>

      {/* 🔥 FILTER */}
      <div className="flex gap-3 mb-6 justify-center">
        {["ALL", "BOOKED", "CANCELLED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {filteredTickets.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No tickets found
        </p>
      ) : (
        <div className="space-y-6">
          {filteredTickets.map((t) => {
            const event = t.event;

            const formattedDate = event?.date
              ? new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "N/A";

            return (
              <div
                key={t._id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row"
              >
                {/* IMAGE */}
                <img
                  src={
                    event?.images?.[0]
                      ? `${import.meta.env.VITE_API_URL}${event.images[0]}`
                      : "/no-image.png"
                  }
                  className="w-full md:w-48 h-40 object-cover"
                />

                {/* DETAILS */}
                <div className="p-5 flex-1 space-y-2">

                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">
                        {event?.title}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {formattedDate} • {event?.time}
                      </p>

                      <p className="text-sm text-gray-600">
                        📍 {event?.location}
                      </p>

                      <p className="text-sm">
                        🎟 {t.ticketType} • Qty: {t.quantity}
                      </p>

                      <p className="text-xs text-gray-500">
                        Payment: {t.paymentStatus}
                      </p>
                    </div>

                    {/* STATUS */}
                    <span
                      className={`text-xs px-3 py-1 rounded-full h-fit ${
                        t.status === "BOOKED"
                          ? "bg-green-100 text-green-600"
                          : t.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>

                  {/* INPUT */}
                  {t.status === "BOOKED" && (
                    <input
                      type="email"
                      placeholder="Transfer to email"
                      value={emails[t._id] || ""}
                      onChange={(e) =>
                        setEmails({ ...emails, [t._id]: e.target.value })
                      }
                      className="mt-3 w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  )}

                  {/* ACTIONS */}
                  {t.status === "BOOKED" && (
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleCancel(t._id)}
                        className="px-4 py-2 text-sm rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => handleTransfer(t._id)}
                        disabled={!emails[t._id]}
                        className={`px-4 py-2 text-sm rounded-xl ${
                          emails[t._id]
                            ? "bg-gray-100 hover:bg-gray-200"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Transfer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTickets;