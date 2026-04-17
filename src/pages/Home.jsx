import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("")

    useEffect(() => {
        API.get("/events")
            .then((res) => setEvents(res.data.events))
            .catch((err) => console.log(err))
    }, []);
     const filteredEvents=events.filter((e)=>{
                        const matchSearch =
                            e.title.toLowerCase().includes(search.toLowerCase()) ||
                            e.location.toLowerCase().includes(search.toLowerCase())
                        const matchCategory =
                            !category || e.category?.toLowerCase() === category.toLowerCase()
                        const matchDate = date ? e.date?.startsWith(date) : true

                        const eventPrice = e.ticketTypes?.[0]?.price || 0;

                        const matchPrice =
                            price === "low"
                                ? eventPrice < 500
                                : price === "mid"
                                    ? eventPrice >= 500 && eventPrice <= 1000
                                    : price === "high"
                                        ? eventPrice > 1000
                                        : true;

                        return matchSearch && matchCategory && matchDate && matchPrice;

 } );

    return (
        <div >
            <h1 className="text-2xl font-bold mb-4">All events</h1>

            <input
                className="border p-2 mb-6 w-full"
                type="text"
                placeholder="search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <select className="border p-2 mb-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value={""}>All categories</option>
                <option value={"music"}>Music</option>
                <option value={"tech"}>Tech</option>
                <option value={"sports"}>Sports</option>

            </select>
            <input
                type="date"
                value={date}
                className="border p-2 mb-3"
                onChange={(e) => setDate(e.target.value)}
            />
            <select
                className="border p-2 mb-3"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            >
                <option value={""}>All prices</option>
                <option value={"low"}>Below 500</option>
                <option value={"mid"}>500-1000</option>
                <option value={"high"}>Above 1000</option>

            </select>
            
               
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
 {filteredEvents.length===0?(
    <p className="col-span-full text-center text-gray 500 mt-10">no event fount</p>
 ):(
                  
                   filteredEvents.map((e) => (
                        <div key={e._id}
                            className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
                        >
                            <img src={`http://localhost:3001${e.images?.[0]}`}
                                alt="event image"
                                className="h-48 w-full object-cover"
                            />
                            <h2 className="text-lg font-semibold mt-2">{e.title}</h2>
                            <p className="text-sm text-gray-500">{e.location}</p>
                            <p className="text-gray-400 text-sm">{new Date(e.date).toDateString()}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-bold text-blue-600"> ₹{e.ticketTypes?.[0]?.price}</p>
                                <span className="text-xs text-gray-200 px-2 py-1 rounded">{e.category}</span>
                            </div>
                            <Link
                                to={`/event/${e._id}`}

                                className="block text-center bg-blue-500 text-white px-3 py-1 mt-2 rounded hover:bg-blue-600">view details</Link>
                        </div>

                    ))

                )}
            </div>
               
        </div>

            )
        }
export default Home;