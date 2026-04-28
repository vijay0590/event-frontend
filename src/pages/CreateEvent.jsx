import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";

const CreateEvent = () => {
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
    { type: "", price: "", total: 0 },
  ]);

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };

 
  const addTicketType = () => {
    setTicketTypes([
      ...ticketTypes,
      { type: "", price: "", total: 0 },
    ]);
  };

  const removeTicket = (index) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedule];
    updated[index][field] = value;
    setSchedule(updated);
  };

  const addSchedule = () => {
    setSchedule([
      ...schedule,
      { title: "", speaker: "", startTime: "", endTime: "" },
    ]);
  };

  const removeSchedule = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      data.append("ticketTypes", JSON.stringify(ticketTypes));
      data.append("schedule", JSON.stringify(schedule));

      if (image) {
        data.append("image", image);
      }

      await API.post("/api/events", data, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      toast.success("Event created successfully!");

      setForm({
        title: "",
        location: "",
        date: "",
        description: "",
        time: "",
        category: "",
      });

      setSchedule([{ title: "", speaker: "", startTime: "", endTime: "" }]);

      //  RESET FIXED
      setTicketTypes([{ type: "", price: "", total: 0 }]);

      setImage(null);

    } catch (error) {
      toast.error(error.response?.data?.message || "Event creation failed");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BackButton />

      <h1 className="text-2xl font-semibold mb-6">Create Event</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC DETAILS */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4">
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
          <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          <input name="time" placeholder="Time" value={form.time} onChange={handleChange} />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        </div>

        {/* SCHEDULE */}
        <div className="bg-white p-5 rounded-xl shadow space-y-3">
          <h2>Schedule</h2>

          {schedule.map((s, i) => (
            <div key={i}>
              <input placeholder="Title" value={s.title} onChange={(e) => handleScheduleChange(i, "title", e.target.value)} />
              <input placeholder="Speaker" value={s.speaker} onChange={(e) => handleScheduleChange(i, "speaker", e.target.value)} />
              <input placeholder="Start Time" value={s.startTime} onChange={(e) => handleScheduleChange(i, "startTime", e.target.value)} />
              <input placeholder="End Time" value={s.endTime} onChange={(e) => handleScheduleChange(i, "endTime", e.target.value)} />
              <button type="button" onClick={() => removeSchedule(i)}>Remove</button>
            </div>
          ))}

          <button type="button" onClick={addSchedule}>+ Add Schedule</button>
        </div>

        {/* 🎟️ TICKETS */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4">
          <h2>Ticket Types</h2>

          {ticketTypes.map((t, i) => (
            <div key={i} className="flex flex-col gap-2">

              <input
                placeholder="Type (general / vip)"
                value={t.type}
                onChange={(e) => handleTicketChange(i, "type", e.target.value)}
              />

              <input
                type="number"
                placeholder="Price"
                value={t.price}
                onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))}
              />

         
              <input
                type="number"
                placeholder="Total tickets"
                value={t.total}
                onChange={(e) => handleTicketChange(i, "total", Number(e.target.value))}
              />

              <button type="button" onClick={() => removeTicket(i)}>
                Remove
              </button>

            </div>
          ))}

          <button type="button" onClick={addTicketType}>
            + Add Ticket Type
          </button>
        </div>

        {/* IMAGE */}
        <div className="bg-white p-5 rounded-xl shadow">
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        {/* SUBMIT */}
        <button disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>

      </form>
    </div>
  );
};

export default CreateEvent;