import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
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
    { type: "", price: "", total: 0, available: 0 },
  ]);

  const [image, setImage] = useState(null);

  // ================= FETCH EVENT =================
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/api/events/${id}`);
        const e = res?.data?.event || res?.data;

        if (!e) {
          toast.error("Event not found");
          return;
        }

        setForm({
          title: e.title,
          description: e.description,
          location: e.location,
          date: e.date?.split("T")[0],
          time: e.time,
          category: e.category,
        });

        setSchedule(Array.isArray(e.schedule) ? e.schedule : []);

        setTicketTypes(
          Array.isArray(e.ticketTypes)
            ? e.ticketTypes
            : [{ type: "", price: "", total: 0, available: 0 }]
        );
      } catch (error) {
        toast.error("Failed to load event");
      }
    };

    fetchEvent();
  }, [id]);

  // ================= HANDLERS =================
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
      { type: "", price: "", total: 0, available: 0 },
    ]);
  };

  const removeTicket = (index) => {
    const updated = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(updated);
  };

  const handleScheduleChange = (i, field, value) => {
    const updated = [...schedule];
    updated[i][field] = value;
    setSchedule(updated);
  };

  const addSchedule = () => {
    setSchedule([
      ...schedule,
      { title: "", speaker: "", startTime: "", endTime: "" },
    ]);
  };

  const removeSchedule = (i) => {
    setSchedule(schedule.filter((_, index) => index !== i));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      data.append("schedule", JSON.stringify(schedule));
      data.append("ticketTypes", JSON.stringify(ticketTypes));

      if (image) {
        data.append("image", image);
      }

      await API.put(`/api/events/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Event updated successfully!");
      navigate("/my-events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // ================= UI =================
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Edit Event</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC DETAILS */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4">
          <input name="title" value={form.title} onChange={handleChange} className="input" />
          <input name="location" value={form.location} onChange={handleChange} className="input" />
          <input type="date" name="date" value={form.date} onChange={handleChange} className="input" />
          <input name="time" value={form.time} onChange={handleChange} className="input" />
          <input name="category" value={form.category} onChange={handleChange} className="input" />
          <textarea name="description" value={form.description} onChange={handleChange} className="input" />
        </div>

        {/* SCHEDULE */}
        <div className="bg-white p-5 rounded-xl shadow space-y-3">
          <h2>Schedule</h2>

          {schedule.map((s, i) => (
            <div key={i} className="border p-3 rounded">
              <input value={s.title} onChange={(e) => handleScheduleChange(i, "title", e.target.value)} />
              <input value={s.speaker} onChange={(e) => handleScheduleChange(i, "speaker", e.target.value)} />
              <input value={s.startTime} onChange={(e) => handleScheduleChange(i, "startTime", e.target.value)} />
              <input value={s.endTime} onChange={(e) => handleScheduleChange(i, "endTime", e.target.value)} />

              <button type="button" onClick={() => removeSchedule(i)}>Remove</button>
            </div>
          ))}

          <button type="button" onClick={addSchedule}>+ Add Schedule</button>
        </div>

        {/*  TICKETS */}
        <div className="bg-white p-5 rounded-xl shadow space-y-4">
          <h2>Ticket Types</h2>

          {ticketTypes.map((t, i) => (
            <div key={i} className="flex flex-col gap-2 border p-3 rounded">

              <input
                placeholder="Type"
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

              {/* READ ONLY */}
              <p className="text-sm text-gray-500">
                Remaining: {t.available ?? 0}
              </p>

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
        <button className="bg-indigo-600 text-white px-6 py-2 rounded">
          Update Event
        </button>

      </form>
    </div>
  );
};

export default EditEvent;