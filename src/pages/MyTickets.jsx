import { useState,useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const MyTickets=()=>{
  const [tickets,setTickets]=useState([]);
  const [emails,setEmails]=useState({})
  const fetchTickets=async()=>{
    try{
      const res=await API.get("/api/tickets/my")
      setTickets(res.data.tickets)

    }catch(err){
      console.log(err)
    }
    
  }
  const handleCancel=async(id)=>{
    try{
      await API.delete(`/api/tickets/${id}`);
      toast.success("Tickets cancelled");
      fetchTickets() ;//refresh
    }catch(err){
        console.log("ERROR:", err.response?.data);
      toast.error("cancel failed")
    }

};
const handleTransfer=async(id)=>{
  try{
    await API.put(`/api/tickets/transfer/${id}`,{
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
return (
  <div className="max-w-5xl mx-auto px-4 py-10">

    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
      My Tickets
    </h1>

    {tickets.length === 0 ? (
      <div className="text-center text-gray-500 mt-20">
        🎟️ No tickets booked yet
      </div>
    ) : (
      <div className="space-y-5">

        {tickets
          .filter((t) => t.paymentStatus !== "cancelled")
          .map((t) => (
            <div
              key={t._id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
            >

              {/* HEADER */}
              <div className="flex justify-between items-start">

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {t.event?.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Quantity: {t.quantity}
                  </p>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full ${
                  t.paymentStatus === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {t.paymentStatus}
                </span>

              </div>

              {/* TRANSFER INPUT */}
              <input
                type="email"
                placeholder="Transfer ticket to email"
                value={emails[t._id] || ""}
                onChange={(e) =>
                  setEmails({ ...emails, [t._id]: e.target.value })
                }
                className="mt-4 border border-gray-200 px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              {/* ACTIONS */}
             <div className="flex gap-3 mt-4">

  <button
    onClick={() => handleCancel(t._id)}
    className="text-sm px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
  >
    Cancel
  </button>

  <button
    onClick={() => handleTransfer(t._id)}
    className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
  >
    Transfer
  </button>

</div>

            </div>
          ))}

      </div>
    )}

  </div>
);
};

 




export default MyTickets;
