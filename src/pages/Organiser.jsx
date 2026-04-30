import { useState, useEffect } from "react";
import API from "../api/axios";

const Organiser = () => {
const [stats, setStats] = useState({
events: 0,
tickets: 0,
revenue: 0,
});

const [recentEvents, setRecentEvents] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
Promise.all([
API.get("/api/analytics/overall"),
API.get("/api/events?limit=3"),
])
.then(([statsRes, eventsRes]) => {
setStats({
events: statsRes.data?.totalEvents || 0,
tickets: statsRes.data?.totalTickets || 0,
revenue: statsRes.data?.totalRevenue || 0,
});


    setRecentEvents(eventsRes.data?.events || []);
  })
  .catch((err) => console.log(err))
  .finally(() => setLoading(false));

}, []);

if (loading) {
return <p className="text-center mt-10">Loading...</p>;
}

return ( <div className="max-w-6xl mx-auto px-4 py-10">


  {/* HEADER */}
  <h1 className="text-2xl font-semibold text-gray-900 mb-6">
    Dashboard Overview
  </h1>

  {/* STATS */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">

    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">📅 Total Events</p>
      <h2 className="text-2xl font-semibold">{stats.events}</h2>
    </div>

    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">🎟 Total Tickets</p>
      <h2 className="text-2xl font-semibold">{stats.tickets}</h2>
    </div>

    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-sm text-gray-500">💰 Revenue</p>
      <h2 className="text-2xl font-semibold text-indigo-600">
        ₹{stats.revenue.toLocaleString("en-IN")}
      </h2>
    </div>

  </div>

  {/* RECENT EVENTS */}
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h2 className="text-lg font-semibold mb-4">
      Recent Events
    </h2>

    {recentEvents.length === 0 ? (
      <p className="text-gray-500 text-sm">No events found</p>
    ) : (
      <div className="space-y-4">
        {recentEvents.map((e) => (
          <div
            key={e._id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div>
              <p className="font-medium">{e.title}</p>
              <p className="text-sm text-gray-500">
                {new Date(e.date).toDateString()}
              </p>
            </div>

            <span className="text-sm text-indigo-600">
              {e.category}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>

</div>


);
};

export default Organiser;
