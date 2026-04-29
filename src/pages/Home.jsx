import { useState, useEffect } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom"

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
    const scrollToEvents = () => {

        const section = document.getElementById("events");
        section?.scrollIntoView({ behavior: "smooth" });
    };
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
        <>
            <section className="relative bg-gradient-to-b from-indigo-50 to-white py-24 px-6">

                {/* subtle background glow */}
                <div className="absolute top-[-60px] left-[-60px] w-[300px] h-[300px] bg-indigo-100 rounded-full blur-[80px] opacity-50" />
                <div className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] bg-purple-100 rounded-full blur-[70px] opacity-40" />

                <div className="relative max-w-4xl mx-auto text-center">

                    {/* small label */}
                    <p className="text-indigo-600 text-sm font-medium mb-4">
                        Discover events around you
                    </p>

                    {/* headline */}
                    <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 leading-tight">
                        Find and Book{" "}
                        <span className="text-indigo-600">
                            Amazing Events
                        </span>
                    </h1>

                    {/* subtext */}
                    <p className="mt-5 text-gray-500 max-w-xl mx-auto text-base md:text-lg">
                        Explore concerts, workshops, and meetups happening near you.
                        Book tickets easily and manage everything in one place.
                    </p>

                    {/* CTA */}
                    <button
                        onClick={scrollToEvents}
                        className="mt-8 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Explore Events
                    </button>

                    {/* categories */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                        <span>🎵 Concerts</span>
                        <span>🎨 Workshops</span>
                        <span>🍽️ Food</span>
                        <span>🏃 Sports</span>
                        <span>🎤 Talks</span>
                    </div>

                </div>

            </section>
            <div id="events" className="scroll-mt-32 max-w-7xl mx-auto px-4 py-12">

                <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col gap-3 md:flex-row md:flex-wrap">
                    <input
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full sm:flex-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        type="text"
                        placeholder="search events..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">

                        {["music", "tech", "sports", "entertainment", "health"].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-sm transition ${category === cat
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}

                        {/* Clear filter */}
                        <button
                            onClick={() => setCategory("")}
                            className="px-4 py-1.5 text-sm text-gray-500 hover:underline"
                        >
                            Clear
                        </button>

                    </div>
                    <div>
                        <input
                            type="date"
                            value={date || ""}
                            onChange={(e) => setDate(e.target.value)}
                            className="border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">

                        {[
                            { label: "All", value: "" },
                            { label: "Below ₹500", value: "low" },
                            { label: "₹500 - ₹1000", value: "mid" },
                            { label: "Above ₹1000", value: "high" },
                        ].map((p) => (
                            <button
                                key={p.value}
                                onClick={() => setPrice(p.value)}
                                className={`px-4 py-1.5 rounded-full text-sm transition ${price === p.value
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}

                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
                            <div
                                key={e._id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden"
                            >

                                {/* IMAGE */}
                                <div className="relative">
                                   <img
  src={
    e.images?.[0]
      ? `${import.meta.env.VITE_API_URL}${event.images[0]}`
      : "/no-image.png"
  }
  className="w-full h-48 object-cover rounded-xl"
/>

                                    {/* CATEGORY BADGE */}
                                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                                        {e.category}
                                    </span>
                                </div>

                                {/* CONTENT */}
                                <div className="p-4">

                                    {/* TITLE */}
                                    <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">
                                        {e.title}
                                    </h2>

                                    {/* DATE + LOCATION */}
                                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                                        <p>📅 {new Date(e.date).toDateString()}</p>
                                        <p>📍 {e.location}</p>
                                    </div>

                                    {/* PRICE + CTA */}
                                    <div className="flex justify-between items-center mt-4">

                                        <p className="text-indigo-600 font-semibold">
                                            ₹{e.ticketTypes?.[0]?.price || "Free"}
                                        </p>

                                        <Link
                                            to={`/event/${e._id}`}
                                            className="text-sm font-medium text-indigo-600 hover:underline"
                                        >
                                            View Details →
                                        </Link>

                                    </div>

                                </div>

                            </div>
                        ))

                    )}
                </div>

            </div>
        </>
    )
}
export default Home;