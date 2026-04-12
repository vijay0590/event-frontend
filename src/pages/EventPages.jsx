
import { useState, useEffect } from "react"
import API from "../api/axios"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast";
const EventPages = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null)
  const[selectedType,setSelectedType]=useState("")
  const[quantity,setQuantity]=useState(1)
  const[paymentMethod,setPaymentMethod]=useState("upi")
  useEffect(() => {
    API.get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data.event||res.data);
      })
      .catch((err) => console.log(err))
  }, [id]);

  if (!event) return <div>loading...</div>
  const handleBooking=async()=>{
    if(!selectedType) return toast.error("select ticket type")
      try{
       await API.post("/tickets",{
        eventId:event._id,
        quantity,
        ticketType:selectedType,
        paymentMethod:"upi"


       });
       toast.success("Ticket booked")

       
  }catch(error){
    toast.error(error.response?.data?.message||"booking failed")
  }

  };
      
    

  


  return (
    <div className="max-w-3xl mx-auto">
      <img
        src={`http://localhost:3001${event.images?.[0]}`}
        className="w-full h-60 object-cover rounded"
      />
      <h1 className="text-2xl font-bold mt-3">{event.title}</h1>
      <p className="text-gray-600">{event.location}</p>
      <p className="mt-2">{event.description}</p>
      <h1 className="mt-4 text-lg font-bold">Schedule</h1>
      <h1 className="mt-4 font-bold">Tickets</h1>
      {event.schedule && event.schedule.length > 0 ? (
  event.schedule.map((s, i) => (
    <div key={i} className="border p-2 mt-2 rounded">
      <p className="font-semibold">{s.title}</p>
      <p className="text-sm text-gray-600">{s.time}</p>
    </div>
  ))
) : (
  <p className="text-gray-500">No schedule available</p>
)}
      {event.ticketTypes.map((t, i) => (
      <div key={i}
          className="border p-2 mt-2 rounded"
        >
          <div>
          <p>{t.type}</p>
          <p>₹{t.price}</p>
          </div>
          <button
          key={t.type}
          onClick={()=>setSelectedType(t.type)}
          className={`px-2 py-1 rounded ${selectedType===t.type
            ?"bg-green-500 text-white":"bg-gray-200"
          }`}
          >select</button>
          
       </div>
        ))}
        <div className="mt-4">
          <p>Quantity</p>
          <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e)=>setQuantity(Number(e.target.value))}
          className="border p-1 w-20"
          />
        </div>
        <select
        
           value={paymentMethod}
           onChange={(e)=>setPaymentMethod(e.target.value)}
           className="border p-2"
        >
          <option value={"upi"}>UPI</option>
          <option value={"card"}>CARD</option>
          <option value={"netbanking"}>NET BANKING</option>
          </select>
        <button
        onClick={handleBooking}
        className="bg-blue-500 text-white px-4 py-2 mt-4rounded"
        >Book Ticket</button>
   </div>
  )
}

export default EventPages
