import { useState, useEffect, useContext } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import PageLayout from "../components/PageLayout";
import { AuthContext } from "../context/AuthContext";

const AdminUsers = () => {
  const { user: currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      toast.error("Failed to retrieve user directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== DELETE USER =====
  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      return toast.error("Self-deletion is disabled for safety.");
    }

    if (!window.confirm("Are you sure? This will remove all user data and ticket history.")) return;

    try {
      setActionLoading(id);
      await API.delete(`/api/admin/users/${id}`);
      toast.success("User account purged.");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      toast.error("Deletion protocol failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // ===== UPDATE ROLE =====
  const handleRoleUpdate = async (id, newRole) => {
    if (id === currentUser?._id) {
      return toast.error("You cannot demote yourself.");
    }

    try {
      setActionLoading(id);
      await API.put(`/api/users/role/${id}`, { role: newRole });
      toast.success(`Role elevated to ${newRole}`);
      
      // Snappy local update
      setUsers(prev => prev.map(u => 
        u._id === id ? { ...u, role: newRole } : u
      ));
    } catch (err) {
      toast.error("Permission update failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // Filter Logic
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        <header className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Identity Management</h1>
          <p className="text-gray-500">Manage permissions and oversee platform participants.</p>
        </header>

        {/* SEARCH BAR */}
        <div className="mb-6 relative max-w-md">
           <input
              type="text"
              placeholder="Find user by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition shadow-sm"
            />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-medium">Syncing user database...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
            <p className="text-gray-400 font-medium italic">No users found matching your criteria.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Current Role</th>
                    <th className="px-6 py-4">Account ID</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u) => {
                    const isSelf = u._id === currentUser?._id;

                    return (
                      <tr key={u._id} className={`hover:bg-gray-50/50 transition ${isSelf ? 'bg-indigo-50/20' : ''}`}>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                               {u.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 flex items-center gap-2">
                                {u.name}
                                {isSelf && <span className="bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-md">YOU</span>}
                              </p>
                              <p className="text-xs text-gray-400">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <select
                            value={u.role}
                            disabled={isSelf || actionLoading === u._id}
                            onChange={(e) => handleRoleUpdate(u._id, e.target.value)}
                            className={`text-xs font-bold border-none rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition ${
                                u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                u.role === 'organiser' ? 'bg-purple-100 text-purple-700' :
                                'bg-gray-100 text-gray-600'
                            } disabled:opacity-50`}
                          >
                            <option value="user">User</option>
                            <option value="organiser">Organiser</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td className="px-6 py-4">
                          <code className="text-[10px] text-gray-400 font-mono">#{u._id.slice(-8)}</code>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(u._id)}
                            disabled={isSelf || actionLoading === u._id}
                            className="text-xs font-black text-red-400 hover:text-red-600 uppercase tracking-tighter disabled:opacity-0 transition"
                          >
                            {actionLoading === u._id ? "..." : "Terminate"}
                          </button>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminUsers;