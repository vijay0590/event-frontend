import { useState,useEffect } from "react"
import API from "../api/axios"
import { Link } from "react-router-dom";


const AdminDashboard =() => {
  const[stats,setStats]=useState({
    users:0,
    events:0,
    revenue:0
  });
  useEffect(()=>{
    API.get("/admin")
    .then ((res)=>setStats({
        users: res.data.users,
  events: res.data.events,
  revenue: res.data.revenue
    }))
    .catch((err)=>console.log(err))
  },[])

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-5 rounded">
          <h2>Total Users</h2>
          <p className="text-xl">{stats.users}</p>
        </div>
         <div className="bg-green-500 text-white p-5 rounded">
          <h2>Total Events</h2>
          <p className="text-xl">{stats.events}</p>
        </div>
         <div className="bg-purple-500 text-white p-5 rounded">
          <h2>Total Revenue</h2>
          <p className="text-xl">{stats.revenue}</p>
        </div>
      </div>
      <Link to="/admin-events">Manage Events</Link>
    </div>
  )
}

export default AdminDashboard
