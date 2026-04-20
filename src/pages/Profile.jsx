import { useContext,useState } from "react"
import API from "../api/axios"
import toast from "react-hot-toast"
import { AuthContext } from "../context/AuthContext"

const Profile = () => {
    const {user,setUser}=useContext(AuthContext)
    const [form, setForm] = useState({
  name: user?.name || "",
  email: user?.email || "",
});
   if (!user) return <p>loading...</p>
   const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });
};
const handleUpdate = async () => {
  try {
    const res = await API.put("/users/me", form);

    setUser(res.data); // update context
    toast.success("Profile updated");
  } catch {
    toast.error("Update failed");
  }
};


 
  return (
  <div className="max-w-md mx-auto p-5">
    <h1 className="text-xl font-bold mb-4">Edit Profile</h1>

    <div className="border p-4 rounded space-y-3">

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white p-2 w-full rounded"
      >
        Update
      </button>
    </div>
  </div>
);
}

export default Profile;
