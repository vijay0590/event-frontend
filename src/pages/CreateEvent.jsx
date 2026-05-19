import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all duration-200";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
    category: "",
  });

  const [schedule, setSchedule] = useState([
    { title: "", speaker: "", startTime: "", endTime: "" },
  ]);

  const [ticketTypes, setTicketTypes] = useState([
    { type: "general", price: 0, total: 100 },
  ]);

  // Clean up image preview URL to prevent memory leaks
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleScheduleChange = (i, field, value) => {
    const updated = [...schedule];
    updated[i][field] = value;
    setSchedule(updated);
  };

  const handleTicketChange = (i, field, value) => {
    const updated = [...ticketTypes];
    updated[i][field] = value;
    setTicketTypes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation
    if (!form.title || !form.location || !form.date || !form.category || !image) {
      return toast.error("Please fill all required fields and upload a banner");
    }

    try {
      setLoading(true);
      const data = new FormData();
      
      // Sync available seats explicitly with total count on configuration setup
      const parsedTicketTypes = ticketTypes.map((ticket) => ({
        type: ticket.type.toLowerCase(),
        price: Number(ticket.price) || 0,
        total: Number(ticket.total) || 0,
        available: Number(ticket.total) || 0, // Critical backend sync metric
      }));

      Object.keys(form).forEach((key) => data.append(key, form[key]));
      data.append("schedule", JSON.stringify(schedule));
      data.append("ticketTypes", JSON.stringify(parsedTicketTypes));
      data.append("image", image);

      await API.post("/api/events", data);

      toast.success("Event created successfully! 🎉");
      navigate("/my-events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Host an Event</h1>
          <p className="text-gray-500 text-lg mt-1">Fill in the details to launch your experience.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. BASIC INFO */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">1</span>
              <h2 className="text-xl font-bold">Event Basics</h2>
            </div>
            
            <div className="space-y-4">
              <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} className={inputClass} />
              <input name="location" placeholder="Venue / Location (or 'Online')" value={form.location} onChange={handleChange} className={inputClass} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="date" name="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={handleChange} className={inputClass} />
                <input type="time" name="time" value={form.time} onChange={handleChange} className={inputClass} />
                <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                  <option value="">Category</option>
                  <option value="music">Music</option>
                  <option value="tech">Tech</option>
                  <option value="sports">Sports</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="Health">Health</option>
                </select>
              </div>
              <textarea name="description" placeholder="Describe the vibe, the rules, and what to expect..." value={form.description} onChange={handleChange} className={`${inputClass} h-32 resize-none`} />
            </div>
          </section>

          {/* 2. TICKETING */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
             <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">2</span>
                <h2 className="text-xl font-bold">Tickets</h2>
              </div>
              <button type="button" onClick={() => setTicketTypes([...ticketTypes, { type: "", price: 0, total: 100 }])} className="text-indigo-600 text-sm font-bold">+ ADD TIER</button>
            </div>

            <div className="space-y-3">
              {ticketTypes.map((t, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl relative animate-in fade-in zoom-in-95 duration-300">
                  <select value={t.type} onChange={(e) => handleTicketChange(i, "type", e.target.value)} className={inputClass}>
                    <option value="general">General</option>
                    <option value="vip">VIP</option>
                  </select>
                  <input type="number" placeholder="Price (₹)" value={t.price || ""} onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))} className={inputClass} />
                  <div className="flex gap-2">
                     <input type="number" placeholder="Qty" value={t.total || ""} onChange={(e) => handleTicketChange(i, "total", Number(e.target.value))} className={inputClass} />
                     {ticketTypes.length > 1 && (
                       <button type="button" onClick={() => setTicketTypes(ticketTypes.filter((_, idx) => idx !== i))} className="w-12 text-rose-500 hover:bg-rose-50 rounded-xl">✕</button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. SCHEDULE */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</span>
                <h2 className="text-xl font-bold">Event Schedule / Timeline</h2>
              </div>
              <button type="button" onClick={() => setSchedule([...schedule, { title: "", speaker: "", startTime: "", endTime: "" }])} className="text-indigo-600 text-sm font-bold">+ ADD LINE</button>
            </div>

            <div className="space-y-3">
              {schedule.map((s, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-2xl relative">
                  <input placeholder="Session Title" value={s.title} onChange={(e) => handleScheduleChange(i, "title", e.target.value)} className={inputClass} />
                  <input placeholder="Speaker / Guest" value={s.speaker} onChange={(e) => handleScheduleChange(i, "speaker", e.target.value)} className={inputClass} />
                  <input type="time" placeholder="Start Time" value={s.startTime} onChange={(e) => handleScheduleChange(i, "startTime", e.target.value)} className={inputClass} />
                  <div className="flex gap-2">
                    <input type="time" placeholder="End Time" value={s.endTime} onChange={(e) => handleScheduleChange(i, "endTime", e.target.value)} className={inputClass} />
                    {schedule.length > 1 && (
                      <button type="button" onClick={() => setSchedule(schedule.filter((_, idx) => idx !== i))} className="w-12 text-rose-500 hover:bg-rose-50 rounded-xl">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. BANNER */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">4</span>
              <h2 className="text-xl font-bold">Banner Image</h2>
            </div>

            <div className={`relative border-2 border-dashed rounded-3xl p-10 transition-all ${preview ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-200 bg-gray-50'}`}>
              <input type="file" id="img" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              
              {!preview ? (
                <label htmlFor="img" className="flex flex-col items-center cursor-pointer">
                  <span className="text-4xl mb-2">🖼️</span>
                  <span className="font-bold text-gray-900">Click to upload banner</span>
                  <span className="text-sm text-gray-400">High-res landscape images work best</span>
                </label>
              ) : (
                <div className="flex flex-col items-center">
                  <img src={preview} className="h-48 w-full max-w-md object-cover rounded-2xl shadow-lg mb-4" alt="Preview" />
                  <label htmlFor="img" className="text-indigo-600 font-bold text-sm cursor-pointer hover:underline">Replace Image</label>
                </div>
              )}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl text-xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:translate-y-0"
          >
            {loading ? "PROCESSING..." : "PUBLISH EVENT"}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default CreateEvent;