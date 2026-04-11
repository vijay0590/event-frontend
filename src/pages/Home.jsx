import { useState, useEffect } from "react";
import API from "../api/axios";
const Home = () => {
    const [events, setEvents] = useState([]);
    const[search,setSearch]=useState("")

    useEffect(() => {
        API.get("/events")
            .then((res) => setEvents(res.data.events))
            .catch((err) => console.log(err))
    }, []);

   return (
        <div>
            <h1 className="text-2xl font-bold mb-4">All events</h1>
            <input
            className="border p-2 mb-4 w-full"
            type="text"
            placeholder="search events..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            />

            <div className="grid md:grid-cols-3 gap-4">
                {events
                .filter((e)=>
                e.title.toLowerCase().includes(search.toLocaleLowerCase())||
                e.location.toLocaleLowerCase().includes(search.toLowerCase())
                 )
                .map((e) => (
                    <div key={e._id}
                        className="border rounded-lg p-3 shadow"
                    >
                        <img src={`http://localhost:3001${e.images?.[0]}`}
                            alt="event image"
                            className="h-40 w-full object-cover rounded"
                        />
                        <h2 className="text-lg font-bold mt-2">{e.title}</h2>
                        <p className="text-sm text-gray-600">{e.location}</p>
                        <p className="text-sm"> ₹{e.ticketTypes?.[0]?.price}</p>

                        <button className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">view details</button>
                    </div>

                ))}


            </div>

        </div>





    )


}
export default Home;