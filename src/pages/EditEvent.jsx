import { useEffect, useState } from "react"
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
    category: ""
  });
  const [schedule, setSchedule] = useState([
    { title: "", speaker: "", startTime: "", endTime: "" }
  ]);
  const [ticketTypes, setTicketTypes] = useState([
    { type: "", price: "" }
  ])

  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/api/events/${id}`)

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
        })
        setSchedule(Array.isArray(e.schedule) ? e.schedule : []);
        setTicketTypes(Array.isArray(e.ticketTypes) ? e.ticketTypes : []);
      } catch (error) {
        toast.error("failed to load event")
      }

    }
    fetchEvent();
  }, [id])


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })

  }
  const handleTicketChange = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };
  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { type: "", price: "" }])
  }

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
      { title: "", speaker: "", startTime: "", endTime: "" }
    ]);
  };

  const removeSchedule = (i) => {
    setSchedule(schedule.filter((_, index) => index !== i));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => {
        data.append(key, form[key])
      });
      data.append("schedule", JSON.stringify(schedule));

      data.append(
        "ticketTypes",
        JSON.stringify(
          ticketTypes
        )
      );
      if (image) {
        data.append("image", image)
      }
      await API.put(`/api/events/${id}`, data, {
        headers: {
          "content-type": "multipart/form-data"
        }
      })
      toast.success("Event updated succesfully!")
      navigate("/my-events");

    } catch (error) {
      toast.error(error.response?.data?.message || "Event update failed");
    }

  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Edit Event
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* BASIC DETAILS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Basic Details
          </h2>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            name="location"
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
            value={form.time}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

        </div>

        {/* 🧱 SCHEDULE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Schedule
          </h2>

          {(schedule ?? []).map((s, i) => (
            <div key={i} className="border border-gray-200 p-4 rounded-lg space-y-2 bg-gray-50">

              <input
                value={s.title}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full"
                onChange={(e) => handleScheduleChange(i, "title", e.target.value)}
              />

              <input
                value={s.speaker}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full"
                onChange={(e) => handleScheduleChange(i, "speaker", e.target.value)}
              />

              <input
                value={s.startTime}
                className="border border-gray-200 px-3 py-2 rounded-lg w-full"
                onChange={(e) => handleScheduleChange(i, "startTime", e.target.value)}
              />

              <input
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

        {/* 🧱 TICKETS */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">

          <h2 className="text-lg font-semibold text-gray-900">
            Ticket Types
          </h2>

          {Array.isArray(ticketTypes) &&
            ticketTypes.map((t, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-2 items-center">

                <input
                  value={t.type}
                  className="border border-gray-200 px-3 py-2 rounded-lg flex-1 w-full"
                  onChange={(e) => handleTicketChange(i, "type", e.target.value)}
                />

                <input
                  type="number"
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

        {/* 🧱 IMAGE */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-2">

          <h2 className="text-lg font-semibold text-gray-900">
            Update Image
          </h2>

          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-200 px-3 py-2 rounded-lg"
            onChange={(e) => setImage(e.target.files[0])}
          />

        </div>

        {/* SUBMIT */}
        <div className="text-right">

          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Update Event
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditEvent;
