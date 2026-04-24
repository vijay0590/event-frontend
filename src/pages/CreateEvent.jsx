import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

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
    { title: "", speaker: "", startTime: "", endTime: "" }
  ]);

  const [ticketTypes, setTicketTypes] = useState([
    { type: "", price: "" }
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
    setTicketTypes([...ticketTypes, { type: "", price: "" }]);
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
      { title: "", speaker: "", startTime: "", endTime: "" }
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
      setTicketTypes([{ type: "", price: "" }]);
      setImage(null);

    } catch (error) {
      toast.error(error.response?.data?.message || "Event creation failed");
    }

    setLoading(false);

  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Create Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/*  BASIC DETAILS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Basic Details
          </h2>

          <input
            name="title"
            placeholder="Event Title..."
            value={form.title}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            name="time"
            placeholder="Time (e.g. 10:00 AM)"
            value={form.time}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="category"
            placeholder="Category (e.g. music)"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

        </div>

        {/*  SCHEDULE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Schedule
          </h2>

          {schedule.map((s, i) => (
            <div key={i} className="border border-gray-200 p-4 rounded-lg space-y-2 bg-gray-50">

              <input
                placeholder="Title"
                value={s.title}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full"
                onChange={(e) => handleScheduleChange(i, "title", e.target.value)}
              />

              <input
                placeholder="Speaker"
                value={s.speaker}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full"
                onChange={(e) => handleScheduleChange(i, "speaker", e.target.value)}
              />

              <input
                placeholder="Start Time"
                value={s.startTime}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full"
                onChange={(e) => handleScheduleChange(i, "startTime", e.target.value)}
              />

              <input
                placeholder="End Time"
                value={s.endTime}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full"
                onChange={(e) => handleScheduleChange(i, "endTime", e.target.value)}
              />

              <button
                type="button"
                onClick={() => removeSchedule(i)}
                className="text-sm text-red-500 hover:underline"
              >
                Remove
              </button>

            </div>
          ))}

          <button
            type="button"
            onClick={addSchedule}
            className="text-sm px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            + Add Schedule
          </button>

        </div>

        {/*  TICKETS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Ticket Types
          </h2>

          {ticketTypes.map((t, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-2 items-center">

              <input
                placeholder="Type (VIP/GENERAL)"
                value={t.type}
                className="border border-gray-200 px-3 py-2 rounded-lg flex-1 w-full"
                onChange={(e) => handleTicketChange(i, "type", e.target.value)}
              />

              <input
                type="number"
                placeholder="Price"
                value={t.price}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full md:w-28"
                onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))}
              />

              <button
                type="button"
                onClick={() => removeTicket(i)}
                className="text-red-500 text-lg font-bold px-2"
              >
                ×
              </button>

            </div>
          ))}

          <button
            type="button"
            onClick={addTicketType}
            className="text-sm px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            + Add Ticket Type
          </button>

        </div>

        {/*  IMAGE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">

          <h2 className="text-lg font-semibold text-gray-900">
            Event Image
          </h2>

          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-200 px-3 py-2 rounded-lg"
            onChange={(e) => setImage(e.target.files[0])}
          />

        </div>

        {/*  SUBMIT */}
        <div className="text-right">

          <button
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default CreateEvent;
