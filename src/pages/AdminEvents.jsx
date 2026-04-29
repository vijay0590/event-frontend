import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";


const AdminEvents = () => {
  const [events, setEvents] = useState([]);

  const handleApprove = async (id) => {
    try {
      await API.put(`/api/events/${id}/status`, { status: "APPROVED" })
      toast.success("Event approved success")
      fetchEvents();
    } catch (err) {
      toast.error("approve failed")
    }

  };
  const handleReject = async (id) => {
    try {
      await API.put(`/api/events/${id}/status`, { status: "REJECTED" })
      toast.success("Event rejected successfully")
      fetchEvents()
    } catch (err) {
      toast.error("rejection failed")
    }

  };
  const fetchEvents = async (id) => {
    try {
      const res = await API.get("/api/events/admin/pending")
      setEvents(res.data.events);

    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Pending Events
      </h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No pending events 👍
        </p>
      ) : (
        <div className="space-y-4">

          {events.map((e) => (
            <div
              key={e._id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >

              {/* INFO */}
              <div className="mb-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {e.title}
                </h2>

                <p className="text-sm text-gray-500">
                  📍 {e.location}
                </p>

                <p className="text-xs text-gray-400">
                  📅 {new Date(e.date).toDateString()}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">

                <button
                  onClick={() => handleApprove(e._id)}
                  className="px-4 py-1.5 text-sm rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleReject(e._id)}
                  className="px-4 py-1.5 text-sm rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                >
                  Reject
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
export default AdminEvents;