import { useState,useEffect } from "react"
import API from "../api/axios"

const Organiser = () => {
    const[stats,setStats]=useState({
        events:0,
        tickets:0,
        revenue:0
    })
    useEffect(()=>{
    API.get("/api/analytics/overall")
    .then((res)=>{
        setStats({
            events:res.data.totalEvents,
            tickets:res.data.totalTickets,
            revenue:res.data.totalRevenue
        })
    })
    .catch((err)=>console.log(err))
},[])
  return (
  <div className="max-w-6xl mx-auto px-4 py-10">

    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
      Dashboard
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

      {/* EVENTS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

        <p className="text-sm text-gray-500 mb-1">
          Total Events
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">
          {stats.events}
        </h2>

      </div>

      {/* TICKETS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

        <p className="text-sm text-gray-500 mb-1">
          Total Tickets
        </p>

        <h2 className="text-2xl font-semibold text-gray-900">
          {stats.tickets}
        </h2>

      </div>

      {/* REVENUE */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

        <p className="text-sm text-gray-500 mb-1">
          Total Revenue
        </p>

        <h2 className="text-2xl font-semibold text-indigo-600">
          ₹{stats.revenue}
        </h2>

      </div>

    </div>

  </div>
);}

export default Organiser
