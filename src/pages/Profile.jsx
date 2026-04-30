import { useContext, useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import BackButton from "../components/BackButton";

const Profile = () => {
const { user, setUser } = useContext(AuthContext);

const [form, setForm] = useState({
name: "",
email: "",
});

const [stats, setStats] = useState({
total: 0,
active: 0,
cancelled: 0,
pending: 0,
});

const [loadingStats, setLoadingStats] = useState(true);
const [saving, setSaving] = useState(false);

//  Sync form when user loads
useEffect(() => {
if (user) {
setForm({
name: user.name || "",
email: user.email || "",
});
}
}, [user]);

// 🔥 FETCH STATS
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
} finally {
  setLoadingStats(false);
}


};

useEffect(() => {
if (user) fetchStats();
}, [user]);

if (!user) return <p className="text-center mt-10">Loading...</p>;

const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleUpdate = async () => {
try {
setSaving(true);


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
} finally {
  setSaving(false);
}


};

return ( <div className="max-w-4xl mx-auto px-4 py-10"> <BackButton />


  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

    {/* HEADER */}
    <div className="flex items-center gap-4 mb-6">
      <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
        {user.name?.[0]?.toUpperCase()}
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

    {/* STATS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

      {loadingStats ? (
        <p className="col-span-full text-center text-gray-500">
          Loading stats...
        </p>
      ) : (
        <>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold">{stats.total}</p>
            <p className="text-sm text-gray-500">Total</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold text-green-600">
              {stats.active}
            </p>
            <p className="text-sm text-gray-500">Active</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold text-yellow-600">
              {stats.pending}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg text-center">
            <p className="text-lg font-semibold text-red-600">
              {stats.cancelled}
            </p>
            <p className="text-sm text-gray-500">Cancelled</p>
          </div>
        </>
      )}

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
        placeholder="Name"
        className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      <button
        onClick={handleUpdate}
        disabled={saving}
        className={`px-4 py-2 rounded-lg text-white ${
          saving
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>

  </div>
</div>


);
};

export default Profile;
