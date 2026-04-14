import { useState ,useEffect} from "react";
import API from "../api/axios";
import toast from "react-hot-toast";


const AdminEvents =()=>{
    const [events,setEvents]=useState([]);

    const handleApprove=async(id)=>{
     try{
    await API.put(`/events/${id}/status`,{status:"APPROVED"})
    toast.success("Event approved success")
    fetchEvents();
}catch(err){
    toast.error("approve failed")
}
        
    };
    const handleReject=async(id)=>{
try{
    await API.put(`/events/${id}/status`,{status:"REJECTED"})
    toast.success("Event rejected successfully")
    fetchEvents()
}catch(err){
    toast.error("rejection failed")
}
        
    };
    const fetchEvents=async(id)=>{
        try{
            const res=await API.get("/events")
            setEvents(res.data.events);

        }catch(err){
           console.log(err)
        }
    }
    useEffect(()=>{
        fetchEvents()
},[])
    
    return(
    <div>
        <h1 className="text-xl font-bold">Admin Events</h1>
        {
            events.map((e)=>(
         <div key={e._id} className="border p-3 mt-2 rounded">
            <p className="font-bold">{e.title}</p>
            <p>{e.location}</p>

            <div className="flex gap-2 mt-2">
                <button onClick={()=>handleApprove(e._id)}
                 className="bg-green-500 text-white px-2 py-1 gap-2 rounded">
                    Approve
                </button>
                <button onClick={()=>handleReject(e._id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
                >Reject

                </button>
            </div>
         </div>
         

            ))
        }

    </div>
    )
}
export default AdminEvents;