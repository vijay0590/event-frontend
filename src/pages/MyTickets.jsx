import { useState,useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const MyTickets=()=>{
  const [tickets,setTickets]=useState([]);
  const [emails,setEmails]=useState({})
  const fetchTickets=async()=>{
    try{
      const res=await API.get("/tickets/my")
      setTickets(res.data.tickets)

    }catch(err){
      console.log(err)
    }
    
  }
  const handleCancel=async(id)=>{
    try{
      await API.delete(`/tickets/${id}`);
      toast.success("Tickets cancelled");
      fetchTickets() ;//refresh
    }catch(err){
        console.log("ERROR:", err.response?.data);
      toast.error("cancel failed")
    }

};
const handleTransfer=async(id)=>{
  try{
    await API.put(`/tickets/transfer/${id}`,{
      newUserEmail:emails[id],

    })
    toast.success("tickets transferred");
    fetchTickets();
    }catch(err){
      console.log(err.response?.data)
      toast.error("transfer failed")

  }

}
  useEffect(()=>{
    fetchTickets()
  },[])

return(
  <div>
    <h1 className="text-xl font-bold">My Tickets</h1>
    {tickets.length==0?(
      <p>No tickets found</p>
    ):(
      tickets
      .filter((t) => t.paymentStatus !== "cancelled")
      .map((t)=>(
        <div 
        className="border p-2 mb-2 rounded"
        key={t._id}>
          <p><b>event:</b>{t.event?.title}</p>
          <p><b>quantity:</b>{t.quantity}</p>
          <p><b>status:</b>{t.paymentStatus}</p>
           <input
      type="email"
      placeholder="Enter email to transfer"
      value={emails[t._id] || ""}
      onChange={(e) =>
        setEmails({ ...emails, [t._id]: e.target.value })
      }
      className="border px-2 py-1 mt-2 w-full"
    />
          <div className="flex gap-2 mt-2">
            <button
            onClick={()=>handleCancel(t._id)}
             className="bg-red-500 text-white px-2 py-1 rounded">cancel
             </button>
            <button 
            onClick={()=>handleTransfer(t._id)}
            className="bg-yellow-500 text-white px-2 py-1 rounded">Transfer
            </button>
          </div>
        </div>
      ))
    )

}
  </div>
)
};

 




export default MyTickets;
