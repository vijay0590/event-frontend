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

  await API.post("/events", data, {
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

return ( <div className="max-w-2xl mx-auto px-4 py-4">

  <h1 className="text-xl md:text-2xl font-bold mb-4">Create Event</h1>

  <form onSubmit={handleSubmit} className="space-y-3">

    <input
      name="title"
      placeholder="Event Title..."
      value={form.title}
      onChange={handleChange}
      className="border w-full p-2 rounded"
      required
    />

    <input
      name="location"
      placeholder="Location"
      value={form.location}
      onChange={handleChange}
      className="border w-full p-2 rounded"
      required
    />

    <input
      type="date"
      name="date"
      value={form.date}
      onChange={handleChange}
      className="border w-full p-2 rounded"
      required
    />

    <input
      name="time"
      placeholder="Time (e.g. 10:00 AM)"
      value={form.time}
      onChange={handleChange}
      className="border w-full p-2 rounded"
    />

    <input
      name="category"
      placeholder="Category (e.g. music)"
      value={form.category}
      onChange={handleChange}
      className="border w-full p-2 rounded"
    />

    <textarea
      name="description"
      placeholder="Description"
      value={form.description}
      onChange={handleChange}
      className="w-full border p-2 rounded"
      required
    />

    {/* Schedule */}
    <h2 className="text-lg font-bold">Schedule</h2>

    {schedule.map((s, i) => (
      <div key={i} className="border p-3 rounded space-y-2">
        <input
          placeholder="Title"
          value={s.title}
          className="border p-2 w-full"
          onChange={(e) => handleScheduleChange(i, "title", e.target.value)}
        />

        <input
          placeholder="Speaker"
          value={s.speaker}
          className="border p-2 w-full"
          onChange={(e) => handleScheduleChange(i, "speaker", e.target.value)}
        />

        <input
          placeholder="Start Time"
          value={s.startTime}
          className="border p-2 w-full"
          onChange={(e) => handleScheduleChange(i, "startTime", e.target.value)}
        />

        <input
          placeholder="End Time"
          value={s.endTime}
          className="border p-2 w-full"
          onChange={(e) => handleScheduleChange(i, "endTime", e.target.value)}
        />

        <button
          type="button"
          className="text-red-500"
          onClick={() => removeSchedule(i)}
        >
          Remove
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={addSchedule}
      className="bg-gray-300 px-3 py-1 rounded"
    >
      + Add Schedule
    </button>

    {/* Ticket Types */}
    <h2 className="text-lg font-bold">Ticket Types</h2>

    {ticketTypes.map((t, i) => (
      <div key={i} className="flex flex-col md:flex-row gap-2">
        <input
          placeholder="Type (VIP/GENERAL)"
          value={t.type}
          className="border p-2 rounded flex-1"
          onChange={(e) => handleTicketChange(i, "type", e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={t.price}
          className="border p-2 rounded w-full md:w-28"
          onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))}
        />

        <button
          type="button"
          className="text-red-500 text-lg px-2 font-bold"
          onClick={() => removeTicket(i)}
        >
          ×
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={addTicketType}
      className="mt-2 bg-gray-300 px-3 py-1 rounded"
    >
      + Add Ticket Type
    </button>

    {/* Image */}
    <input
      type="file"
      accept="image/*"
      className="w-full border p-2 rounded"
      onChange={(e) => setImage(e.target.files[0])}
    />

    {/* Submit */}
    <button
      disabled={loading}
      className="bg-green-500 text-white w-full py-3 rounded hover:bg-green-600"
    >
      {loading ? "Creating Event..." : "Create Event"}
    </button>

  </form>
</div>

);
};

export default CreateEvent;
