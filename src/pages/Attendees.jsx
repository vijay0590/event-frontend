import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const Attendees = () => {
  const { id } = useParams();
  const [attendees, setAttendees] = useState([]);
  const handleExport=async()=>{
    const res= await API.get(`/events/${id}/attendees/export`,{
      responseType:"blob"
    })
    const url=window.URL.createObjectURL(new Blob([res.data]));
    const link=document.createElement("a")
  link.href=url;
  link.setAttribute("download","attendees.csv")
  document.body.appendChild(link)

link.click()
  };

  useEffect(() => {
  const fetchAttendees = async () => {
    try {
      const res = await API.get(`/events/${id}/attendees`);
      
      const data = res.data.attendees;
      setAttendees(Array.isArray(data) ? data : [])

    } catch (err) {
      console.log(err);
      setAttendees([]);
    }
  };

  fetchAttendees();
}, [id]);
  return (
    <div>
      <h1 className="text-xl font-bold">Attendees</h1>
       {attendees.length===0?(
        <p className="text-gray-400">no attendees yet</p>
       ):(
       attendees.map((a) => (
        <div key={a._id} className="border p-2 mt-2 rounded">
          <p>{a.name}</p>
            <p className="text-sm text-gray-600">{a.email}</p>
    <p className="text-sm text-green-600">Tickets: {a.tickets}</p>
 
        </div>
      ))
       )
    }
       <button onClick={handleExport}
    className="bg-green-500 text-white px-3 py-1 mt-3 rounded"
    >Export csv</button>
    </div>
  )
}

export default Attendees
