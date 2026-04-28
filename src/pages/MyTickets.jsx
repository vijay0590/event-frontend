import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [emails, setEmails] = useState({});

  const fetchTickets = async () => {
    try {
      const res = await API.get("/api/tickets/my");
      setTickets(res.data.tickets);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = async (id) => {
    try {
      await API.delete(`/api/tickets/${id}`);
      toast.success("Ticket cancelled");
      fetchTickets();
    } catch (err) {
      console.log(err.response?.data);
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
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Transfer failed");
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
     
  <BackButton />
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        My Tickets
      </h1>

      {tickets.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          🎟️ No tickets booked yet
        </div>
      ) : (
        <div className="space-y-5">
          {tickets.map((t) => (
            <div
              key={t._id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t.event?.title || "Event not available"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Quantity: {t.quantity}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.event?.date} • {t.event?.time}
                  </p>
                  <p className="text-sm text-gray-500">
                    {t.event?.location}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
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

              {/* TRANSFER INPUT (only if booked) */}
              {t.status === "BOOKED" && (
                <input
                  type="email"
                  placeholder="Transfer ticket to email"
                  value={emails[t._id] || ""}
                  onChange={(e) =>
                    setEmails({ ...emails, [t._id]: e.target.value })
                  }
                  className="mt-4 border border-gray-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              )}

              {/* ACTIONS */}
              <div className="flex gap-3 mt-4">
                {/* Cancel only if BOOKED */}
                {t.status === "BOOKED" && (
                  <button
                    onClick={() => handleCancel(t._id)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Cancel
                  </button>
                )}

                {/* Transfer only if BOOKED */}
                {t.status === "BOOKED" && (
                  <button
                    onClick={() => handleTransfer(t._id)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                  >
                    Transfer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;