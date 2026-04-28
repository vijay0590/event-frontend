import { useContext, useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import BackButton from "../components/BackButton";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    cancelled: 0,
    pending: 0,
  });

  // 🔥 FETCH TICKET STATS
  const fetchStats = async () => {
    try {
      const res = await API.get("/api/tickets/my");

      setStats({
        total: res.data.total,
        active: res.data.active,
        cancelled: res.data.cancelled,
        pending: res.data.pending,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  if (!user) return <p>Loading...</p>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await API.put("/api/users/me", form);

      const updatedUser = res.data.user || {
        ...user,
        name: form.name,
        email: form.email,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <BackButton/>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {user.name?.[0]}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500">
              {user.email}
            </p>
          </div>
        </div>

        <p className="text-sm text-indigo-600 font-medium mb-6">
          Role: {user.role}
        </p>

        {/* ✅ REAL STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold text-green-600">{stats.active}</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>

        </div>

        {/* EDIT FORM */}
        <div className="border-t pt-6 mt-6 space-y-4">
          <h3 className="text-md font-semibold text-gray-800">
            Edit Profile
          </h3>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            onClick={handleUpdate}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;