import { useState, useEffect, useMemo } from "react";
import API from "../api/axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/api/events");
        setEvents(res.data.events || []);
      } catch (error) {
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const scrollToEvents = () => {
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const title = e.title?.toLowerCase() || "";
      const location = e.location?.toLowerCase() || "";
      
      const matchSearch = title.includes(search.toLowerCase()) || 
                          location.includes(search.toLowerCase());
      
      const matchCategory = !category || e.category?.toLowerCase() === category.toLowerCase();
      
      const matchDate = date ? e.date?.startsWith(date) : true;

      const eventPrice = e.ticketTypes?.[0]?.price || 0;
      const matchPrice =
        price === "low" ? eventPrice < 500 :
        price === "mid" ? eventPrice >= 500 && eventPrice <= 1000 :
        price === "high" ? eventPrice > 1000 : true;

      return matchSearch && matchCategory && matchDate && matchPrice;
    });
  }, [events, search, category, date, price]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setDate("");
    setPrice("");
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-24 px-6">
        <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-indigo-200 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-[-120px] right-[-80px] w-[300px] h-[300px] bg-purple-200 rounded-full blur-[120px] opacity-40" />

        <div className="relative max-w-5xl mx-auto text-center">
          <p className="inline-block px-4 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full mb-5 font-medium">
            Discover events near you
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
            Find & Book{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Amazing Events
            </span>
          </h1>
          <p className="mt-6 text-gray-500 max-w-2xl mx-auto text-lg">
            Explore concerts, workshops, and meetups happening near you. Book your spot in just a few clicks.
          </p>
          <button
            onClick={scrollToEvents}
            className="mt-8 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
          >
            Explore Events
          </button>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div id="events" className="max-w-7xl mx-auto px-4 py-12">
        {/* FILTERS BAR */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          
          <div className="flex-1">
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Search by title or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select 
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            >
              <option value="">All Prices</option>
              <option value="low">Under ₹500</option>
              <option value="mid">₹500 - ₹1000</option>
              <option value="high">Over ₹1000</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-200 px-3 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {(search || category || date || price) && (
              <button 
                onClick={clearFilters}
                className="text-sm text-red-500 font-medium hover:underline px-2"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* CATEGORY CHIPS */}
<div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
  {["Music", "Tech", "Sports", "Entertainment", "Health"].map((cat) => {
    const normalizedCat = cat.toLowerCase();
    const isActive = category === normalizedCat;

    return (
      <button
        key={cat}
        onClick={() => setCategory(isActive ? "" : normalizedCat)}
        className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          isActive
            ? "bg-indigo-600 text-white shadow-md"
            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
        }`}
      >
        {cat}
      </button>
    );
  })}
</div>
        {/* EVENTS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-20">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Fetching events...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl">
              <p className="text-gray-500 text-lg">No events match your criteria 😕</p>
              <button onClick={clearFilters} className="text-indigo-600 mt-2 font-medium">Reset Filters</button>
            </div>
          ) : (
            filteredEvents.map((e) => {
              const today = new Date().setHours(0, 0, 0, 0);
              const eventDate = new Date(e.date).setHours(0, 0, 0, 0);
              const isPast = eventDate < today;

              return (
                <div key={e._id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={
                        e?.images?.[0]
                          ? `${import.meta.env.VITE_API_URL}/${e.images[0].replace(/^\/+/, "")}`
                          : "/no-image.png"
                      }
                      alt={e.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => (e.target.src = "/no-image.png")}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-lg shadow-sm ${
                        isPast ? "bg-gray-100 text-gray-600" : "bg-green-500 text-white"
                      }`}>
                        {isPast ? "Completed" : "Upcoming"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">{e.category}</span>
                      <p className="font-bold text-gray-900">
                        {e.ticketTypes?.[0]?.price ? `₹${e.ticketTypes[0].price}` : "Free"}
                      </p>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">{e.title}</h3>
                    
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>

                    <Link
                      to={`/event/${e._id}`}
                      className="block w-full text-center py-3 bg-gray-50 text-gray-900 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Home;