import { useState,useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



const MyEvents =() => {
    const [events,setEvents]=useState([]);
    const navigate=useNavigate();
    const handleDelete=async(id)=>{
        try{
            await API.delete(`/events/${id}`);
            toast.success("Event deleted succesfully")
           fetchEvents();
        }catch(error){
        toast.error(error.response?.data?.message,)
        }

    }

    //fetch organiser events
 const fetchEvents=async()=>{
     try{

   const res= await API.get("/events/me/")
   setEvents(res.data.events)
}catch(error){
    toast.error(error.response?.data?.message)
}
    }
    useEffect(()=>{
        fetchEvents();
    },[])
    

  return (
    <div>
      <h1 className="text-xl font-bold">My Events</h1>
      {events.map((e)=>(
        <div key={e._id}
        className="border p-3 mt-r rounded">
        <p className="font-bold">{e.title}</p>
        <p>{e.location}</p>
        <p>{e.date}</p>
        <Link to={`/attendees/${e._id}`}
        className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
        >
        View Attendees
        </Link>
        <button className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
                onClick={()=>navigate(`/edit-event/${e._id}`)}
        >Edit Event</button>
         <button onClick={()=>{handleDelete(e._id)}}
      className="bg-red-500 text-white px-2 py-1 mt-2 rounded"
      >Delete</button>
        </div>
        

      ))}
     
    </div>
  )
}

export default MyEvents;
