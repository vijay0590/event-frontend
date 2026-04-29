import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none";

const CreateEvent = () => {
  const navigate = useNavigate();

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
    { type: "", price: 0, total: 0 },
  ]);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===== HANDLERS =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleScheduleChange = (i, field, value) => {
    const updated = [...schedule];
    updated[i][field] = value;
    setSchedule(updated);
  };

  const addSchedule = () => {
    setSchedule([...schedule, { title: "", speaker: "", startTime: "", endTime: "" }]);
  };

  const removeSchedule = (i) => {
    setSchedule(schedule.filter((_, index) => index !== i));
  };

  const handleTicketChange = (i, field, value) => {
    const updated = [...ticketTypes];
    updated[i][field] = value;
    setTicketTypes(updated);
  };

  const addTicket = () => {
    setTicketTypes([...ticketTypes, { type: "", price: "", total: 0 }]);
  };

  const removeTicket = (i) => {
    setTicketTypes(ticketTypes.filter((_, index) => index !== i));
  };

  // ===== SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));

      data.append("schedule", JSON.stringify(schedule));
      data.append("ticketTypes", JSON.stringify(ticketTypes));
      if (image) data.append("image", image);

      await API.post("/api/events", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event created!");
      navigate("/my-events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BackButton />

      <h1 className="text-3xl font-bold text-center mb-10">
        Create Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Basic Details</h2>

          <input name="title" placeholder="Event Title" value={form.title} onChange={handleChange} className={inputClass} />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className={inputClass} />

          <div className="grid grid-cols-2 gap-4">
            <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
            <input name="time" placeholder="Time" value={form.time} onChange={handleChange} className={inputClass} />
          </div>

          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className={inputClass} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className={`${inputClass} h-24`} />
        </div>

        {/* SCHEDULE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Schedule</h2>

          {schedule.map((s, i) => (
            <div key={i} className="space-y-3">
              <input placeholder="Session Title" value={s.title} onChange={(e) => handleScheduleChange(i, "title", e.target.value)} className={inputClass} />
              <input placeholder="Speaker" value={s.speaker} onChange={(e) => handleScheduleChange(i, "speaker", e.target.value)} className={inputClass} />

              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Start Time" value={s.startTime} onChange={(e) => handleScheduleChange(i, "startTime", e.target.value)} className={inputClass} />
                <input placeholder="End Time" value={s.endTime} onChange={(e) => handleScheduleChange(i, "endTime", e.target.value)} className={inputClass} />
              </div>

              <button type="button" onClick={() => removeSchedule(i)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addSchedule} className="text-indigo-600 text-sm font-medium">
            + Add Schedule
          </button>
        </div>

        {/* TICKETS */}
        <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold">Tickets</h2>

          {ticketTypes.map((t, i) => (
            <div key={i} className="space-y-3">

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Ticket Type (VIP / General)"
                  value={t.type}
                  onChange={(e) => handleTicketChange(i, "type", e.target.value)}
                  className={inputClass}
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Price (₹)"
                 value={t.price === 0 ? "" : t.price}
                  onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))}
                  className={inputClass}
                />
              </div>

              <input
                type="number"
                min="0"
                placeholder="Total Tickets Available"
                value={t.total === 0 ? "" : t.total}
                onChange={(e) =>
                  handleTicketChange(i, "total", Number(e.target.value))
                }
                className={inputClass}
              />

              <button type="button" onClick={() => removeTicket(i)} className="text-red-500 text-sm">
                Remove
              </button>
            </div>
          ))}

          <button type="button" onClick={addTicket} className="text-indigo-600 text-sm font-medium">
            + Add Ticket
          </button>
        </div>

        {/* IMAGE */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Event Image</h2>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* SUBMIT */}
        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>
    </div>
  );
};

export default CreateEvent;