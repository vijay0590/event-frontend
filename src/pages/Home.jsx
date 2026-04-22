import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState("");
    const [price, setPrice] = useState("")
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get("/api/events")
            .then((res) => {
                setEvents(res.data.events);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);
    const filteredEvents = events.filter((e) => {
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

    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Explore Events</h1>
            <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col gap-3 md:flex-row md:flex-wrap">
                <input
                    className="border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 p-2 rounded w-full sm:flex-1"
                    type="text"
                    placeholder="search events..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value={""}>All </option>
                    <option value={"music"}>Music</option>
                    <option value={"tech"}>Tech</option>
                    <option value={"sports"}>Sports</option>
                    <option value={"entertainment"}>Entertainment</option>
                    <option value={"health"}>Health</option>

                </select>
                <div className="flex flex-col">
                <input
                    type="date"
                    value={date || ""}
                    className="w-full md:w-auto border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500"
                    onChange={(e) => setDate(e.target.value)}
                />
                {date && (
                    <p className="text-xs text-indigo-600 mt-1">
                        📅 {new Date(date).toDateString()}
                    </p>
                )}
                </div>
                <select
                    className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                >
                    <option value={""}>All prices</option>
                    <option value={"low"}>Below 500</option>
                    <option value={"mid"}>500-1000</option>
                    <option value={"high"}>Above 1000</option>

                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-10 text-gray-500 animate-pulse">
                        Loading events...
                    </p>
                ) : filteredEvents.length === 0 ? (
                    <p className="col-span-full text-center text-gray-500 mt-10">
                        No events found 😕
                    </p>
                ) : (

                    filteredEvents.map((e) => (
                        <div key={e._id}
                            className="bg-white rounded-xl shadow hover:shadow-2xl transition duration-300 overflow-hidden p-3">
                            <img src={e.images?.[0]}
                                alt="event image"
                                className="h-48 w-full object-cover"
                            />
                            <h2 className="text-lg font-semibold mt-2 text-gray-800">{e.title}</h2>
                            <p className="text-sm text-gray-500">{e.location}</p>
                            <p className="text-gray-400 text-sm">{new Date(e.date).toDateString()}</p>
                            <div className="flex justify-between items-center mt-2">
                                <p className="font-bold text-blue-600"> ₹{e.ticketTypes?.[0]?.price}</p>
                                <span className="text-xs text-gray-200 px-2 py-1 rounded">{e.category}</span>
                            </div>
                            <Link
                                to={`/event/${e._id}`}

                                className="block text-center bg-blue-600 text-white font-semibold px-3 py-1 mt-2 rounded hover:bg-blue-700">view details</Link>
                        </div>

                    ))

                )}
            </div>

        </div>

    )
}
export default Home;