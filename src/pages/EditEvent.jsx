import { useEffect, useState } from "react"
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate,useParams } from "react-router-dom";

const EditEvent = () => {
    const {id}=useParams();
    const navigate=useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    category: ""
    });
     const [schedule, setSchedule] = useState([
    { title: "", speaker: "", startTime: "", endTime: "" }
  ]);
  const [ticketTypes, setTicketTypes] = useState([
    { type: "", price: "" }
  ])

  const [image, setImage] = useState(null);

  useEffect(()=>{
    const fetchEvent=async()=>{
        try{
            const res=await API.get(`/events/${id}`)
               
  const e = res?.data?.event || res?.data;
  if (!e) {
  toast.error("Event not found");
  return;
}
       
            setForm({
                title: e.title,
          description: e.description,
          location: e.location,
          date: e.date?.split("T")[0],
          time: e.time,
          category: e.category,
            })
         setSchedule(Array.isArray(e.schedule) ? e.schedule : []);
         setTicketTypes(Array.isArray(e.ticketTypes) ? e.ticketTypes : []);
        }catch(error){
            toast.error("failed to load event")
        }

    }
fetchEvent();
},[id])

 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })

  }
  const handleTicketChange = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };
 const addTicketType = () => {
    setTicketTypes([...ticketTypes, {type: "", price: "" }])
  }

  const removeTicket = (index) => {
    const updated = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(updated);
  };
   const handleScheduleChange = (i, field, value) => {
    const updated = [...schedule];
    updated[i][field] = value;
    setSchedule(updated);
  };

  const addSchedule = () => {
    setSchedule([
      ...schedule,
      { title: "", speaker: "", startTime: "", endTime: "" }
    ]);
  };

  const removeSchedule = (i) => {
    setSchedule(schedule.filter((_, index) => index !== i));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key])
      });
  data.append("schedule", JSON.stringify(schedule));
     
  data.append(
        "ticketTypes",
        JSON.stringify(
          ticketTypes
        )
      );
      if (image) {
        data.append("image", image)
      }
      await API.put(`/events/${id}`, data, {
        headers: {
          "content-type": "multipart/form-data"
        }
      })
      toast.success("Event updated succesfully!")
    navigate("/my-events");

    } catch (error) {
      toast.error(error.response?.data?.message || "Event update failed");
    }

  }
  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-lg font-bold">Edit Event</h1>
      <form onSubmit={handleSubmit}
        className="space-y-3">
        <input
          name="title"
          placeholder="Event Title..."
          value={form.title}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          required
        />
        <input
          name="location"
          placeholder="location"
          value={form.location}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          required
        />
        <input
        type="date"
          name="date"
          placeholder="date"
          value={form.date}
          onChange={handleChange}
          className="border w-full p-2 rounded"
          required
        />
        <input
          name="time"
          placeholder="Time (e.g. 10:00 AM)"
          className="border p-2 w-full"
          value={form.time}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category (e.g. music)"
          className="border p-2 w-full"
          value={form.category}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        
        <h1 className="text-xl font-bold">Schedule</h1>
        
          {(schedule ?? []).map((s, i) => (
            <div key={i}
            className="border p-2 rounded space-y-1"
            >
           <input placeholder="title"
                  value={s.title}
                  className="border p-1 w-full"
                  onChange={(e)=>handleScheduleChange(i,"title",e.target.value)}
           />
             <input placeholder="speaker"
                  value={s.speaker}
                  className="border p-1 w-full"
                  onChange={(e)=>handleScheduleChange(i,"speaker",e.target.value)}
           />
             <input placeholder="StartTime"
                  value={s.startTime}
                  className="border p-1 w-full"
                  onChange={(e)=>handleScheduleChange(i,"startTime",e.target.value)}
           />
             <input placeholder="EndTime"
                  value={s.endTime}
                  className="border p-1 w-full"
                  onChange={(e)=>handleScheduleChange(i,"endTime",e.target.value)}
           />
           <button type="button"
                   className="text-red-500"
                   onClick={()=>removeSchedule(i)}  
           >
            remove
           </button>

            </div>
          ))

        }
        <button type="button"
         className="bg-gray-300 px-2 py-1 rounded"
                onClick={addSchedule}
        >+ Add schedule</button>
        <h1 className="text-xl font-bold">Ticket Types</h1>
        <div>
          {
            Array.isArray(ticketTypes) &&ticketTypes.map((t, i) => (
              <div key={i}
                className="flex items-center gap-2"
              >
                <input
                  placeholder="Type(VIP/GENERAL)"
                  value={t.type}
                  className="border p-2 rounded flex-1"
                  onChange={(e) => handleTicketChange(i, "type", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="price"
                  className="border p-2 rounded w-28"
                  value={t.price}
                  onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))}
                />
                <button
                  type="button"
                  className="text-red-500 text-lg px-2 font-bold"
                  onClick={()=>removeTicket(i)}> ×</button>

              </div>
            ))
          }
          <button
            type="button"
            onClick={addTicketType}>+Add Ticket Type</button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          
        />
        <button
          className="bg-green-500 text-white w-full p-2 rounded hover:bg-green-600"
        >Update Event</button>
      </form>
    </div>
  )
}

export default EditEvent;
