import { useEffect, useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import PageLayout from "../components/PageLayout";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all duration-200";

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

  const [ticketTypes, setTicketTypes] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); // Local preview of new upload
  const [currentImage, setCurrentImage] = useState(null); // Existing image from DB
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await API.get(`/api/events/${id}`);
        const e = res.data?.event || res.data;

        setForm({
          title: e.title || "",
          description: e.description || "",
          location: e.location || "",
          date: e.date ? new Date(e.date).toISOString().split("T")[0] : "",
          time: e.time || "",
          category: e.category || "",
        });

        setTicketTypes(e.ticketTypes || []);
        setCurrentImage(e.image); // Save existing image path
      } catch (err) {
        toast.error("Failed to load event data");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  // IMAGE PREVIEW LOGIC
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

  const handleTicketChange = (i, field, value) => {
    const updated = [...ticketTypes];
    updated[i][field] = value;
    setTicketTypes(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      data.append("ticketTypes", JSON.stringify(ticketTypes));
      if (image) data.append("image", image);

      await API.put(`/api/events/${id}`, data);
      toast.success("Changes saved! ✨");
      navigate(-1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <PageLayout showBack={false}>
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </PageLayout>
  );

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto pb-20">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit Experience</h1>
          <p className="text-gray-500 text-lg mt-1">Refine the details for {form.title}</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* 1. BASIC DETAILS */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              Basic Info
            </h2>
            <div className="space-y-4">
              <input name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Event Title" />
              <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Location" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
                <input name="time" value={form.time} onChange={handleChange} className={inputClass} placeholder="Time" />
              </div>
              <textarea name="description" value={form.description} onChange={handleChange} className={`${inputClass} h-32 resize-none`} placeholder="Description" />
            </div>
          </section>

          {/* 2. TICKETS */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
                Ticket Tiers
              </h2>
              <button 
                type="button" 
                onClick={() => setTicketTypes([...ticketTypes, { type: "", price: 0, total: 0 }])}
                className="text-indigo-600 text-sm font-bold hover:underline"
              >
                + ADD TIER
              </button>
            </div>
            
            <div className="space-y-3">
              {ticketTypes.map((t, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input placeholder="Type" value={t.type} onChange={(e) => handleTicketChange(i, "type", e.target.value)} className={inputClass} />
                    <input type="number" placeholder="Price" value={t.price} onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))} className={inputClass} />
                    <div className="flex gap-2">
                      <input type="number" placeholder="Total" value={t.total} onChange={(e) => handleTicketChange(i, "total", Number(e.target.value))} className={inputClass} />
                      <button type="button" onClick={() => setTicketTypes(ticketTypes.filter((_, idx) => idx !== i))} className="text-rose-500 px-2 hover:bg-rose-50 rounded-lg">✕</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. IMAGE */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
              Event Banner
            </h2>
            <div className="flex flex-col items-center p-8 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <input type="file" id="edit-img" className="hidden" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              
              <div className="mb-4 relative">
                {preview ? (
                  <img src={preview} className="h-48 w-80 object-cover rounded-2xl shadow-xl border-4 border-white" alt="New" />
                ) : currentImage ? (
                  <img src={currentImage} className="h-48 w-80 object-cover rounded-2xl shadow-md border-4 border-white" alt="Current" />
                ) : (
                  <div className="h-48 w-80 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400">No Image</div>
                )}
              </div>

              <label htmlFor="edit-img" className="cursor-pointer bg-white px-6 py-2 rounded-xl border shadow-sm font-bold text-gray-700 hover:bg-gray-50 transition">
                Replace Banner
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-gray-900 text-white py-5 rounded-2xl text-xl font-black shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? "SAVING CHANGES..." : "UPDATE EVENT"}
          </button>
        </form>
      </div>
    </PageLayout>
  );
};

export default EditEvent;