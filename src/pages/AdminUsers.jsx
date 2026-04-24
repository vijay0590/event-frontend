import { useState, useEffect } from "react"
import API from "../api/axios"
import toast from "react-hot-toast"



const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await API.delete(`/api/admin/users/${id}`)
      toast.success("user deleted succesfully")
      fetchUsers();
    } catch (error) {
      toast.error("delete failed")
    }

  }
  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users")
      setUsers(res.data.users);

    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, []);
  const handleRole = async (id, role) => {
    try {
      await API.put(`/api/users/role/${id}`, { role })
      toast.success("role updated")
      fetchUsers();
    } catch (error) {
      toast.error("update usser failed")
    }

  }
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Users
      </h1>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No users found
        </p>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          <table className="w-full text-sm">

            <thead className="text-left text-gray-500 border-b bg-gray-50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">

                  {/* NAME */}
                  <td className="p-3 font-medium text-gray-900">
                    {u.name}
                  </td>

                  {/* EMAIL */}
                  <td className="p-3 text-gray-500">
                    {u.email}
                  </td>

                  {/* ROLE */}
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRole(u._id, e.target.value)}
                      className="border border-gray-200 px-2 py-1 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="user">User</option>
                      <option value="organiser">Organiser</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-sm px-3 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default AdminUsers;
