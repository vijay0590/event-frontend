import { useState,useEffect } from "react"
import API from "../api/axios"

const Organiser = () => {
    const[stats,setStats]=useState({
        events:0,
        tickets:0,
        revenue:0
    })
    useEffect(()=>{
        API.get("/analytics/overall")
        .then((res)=>setStats({
            events:res.data.totalEvents,
            tickets:res.data.totalTickets,
            revenue:res.data.totalRevenue

        }))
        .catch((err)=>console.log(err))
    },[])
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4 ">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-5 rounded">
            <h2>Total Events</h2>
            <p className="text-xl">{stats.events}</p>
        </div>
        <div className="bg-green-500 text-white p-5 rounded">
            <h2>Total Tickets</h2>
            <p className="text-xl">{stats.tickets}</p>
        </div>
        <div className="bg-purple-500 text-white p-5 rounded">
            <h2>Total Revenue</h2>
            <p className="text-xl">{stats.revenue}</p>
        </div>

      </div>
    </div>
  )
}

export default Organiser
