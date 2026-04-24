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
            await API.delete(`/api/events/${id}`);
            toast.success("Event deleted succesfully")
           fetchEvents();
        }catch(error){
        toast.error(error.response?.data?.message,)
        }

    }

    //fetch organiser events
 const fetchEvents=async()=>{
     try{

   const res= await API.get("/api/events/me/")
   setEvents(res.data.events)
}catch(error){
    toast.error(error.response?.data?.message)
}
    }
    useEffect(()=>{
        fetchEvents();
    },[])
    
return (
  <div className="max-w-5xl mx-auto px-4 py-10">

    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
      My Events
    </h1>

    {events.length === 0 ? (
      <div className="text-center text-gray-500 mt-20">
        📅 No events created yet
      </div>
    ) : (
      <div className="space-y-5">

        {events.map((e) => (
          <div
            key={e._id}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
          >

            {/* HEADER */}
            <div className="flex justify-between items-start">

              <div>
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

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 flex-wrap">

                <Link
                  to={`/attendees/${e._id}`}
                  className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  Attendees
                </Link>

                <button
                  onClick={() => navigate(`/edit-event/${e._id}`)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(e._id)}
                  className="text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>
    )}

  </div>
);
}

export default MyEvents;
