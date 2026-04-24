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
      const res = await API.get(`/api/events/${id}/attendees`);
      
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
  <div className="max-w-5xl mx-auto px-4 py-10">

    <h1 className="text-2xl font-semibold text-gray-900 mb-6">
      Attendees
    </h1>

    {attendees.length === 0 ? (
      <p className="text-center text-gray-500 mt-10">
        No attendees yet
      </p>
    ) : (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

        <table className="w-full text-sm">

          <thead className="text-left text-gray-500 border-b bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Tickets</th>
            </tr>
          </thead>

          <tbody>
            {attendees.map((a) => (
              <tr key={a._id} className="border-b hover:bg-gray-50">

                <td className="p-3 font-medium text-gray-900">
                  {a.name}
                </td>

                <td className="p-3 text-gray-500">
                  {a.email}
                </td>

                <td className="p-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                    {a.tickets}
                  </span>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>
    )}

    {/* EXPORT BUTTON */}
    <div className="mt-4 text-right">
      <button
        onClick={handleExport}
        className="text-sm px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
      >
        Export CSV
      </button>
    </div>

  </div>
);
}

export default Attendees
