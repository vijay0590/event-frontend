import { useState ,useEffect} from "react"
import API from "../api/axios"
import toast from "react-hot-toast"



const AdminUsers = () => {
    const [users,setUsers]=useState([])
    const handleDelete=async(id)=>{
          if (!window.confirm("Are you sure to delete this user?")) return;
        try{
            await API.delete(`/api/admin/users/${id}`)
            toast.success("user deleted succesfully")
            fetchUsers();
        }catch(error){
toast.error("delete failed")
        }

    }
    const fetchUsers=async()=>{
        try{
            const res=await API.get("/api/admin/users")
            setUsers(res.data.users);

        }catch(err){
          console.log(err)
        }
    }
    useEffect(()=>{
        fetchUsers()
    },[]);
    const handleRole=async(id,role)=>{
      try{
        await API.put(`/api/users/role/${id}`,{role})
        toast.success("role updated")
        fetchUsers();
      }catch(error){
        toast.error("update usser failed")
      }

    }
  return (
    <div>
      <h1 className="text-lg font-bold">Users</h1>
      {users.length===0?(
        <p className="text-gray-500">no users found</p>
      ):(
        users.map((u)=>(
            <div key={u._id}
            className="border p-2 mt-3 rounded">
                <p className="font-bold">{u.name}</p>
                <p className="text-sm">{u.email}</p>
               //role change
             <select 
             value={u.role}
             className="border p-1 mt-2"
             onChange={(e)=>handleRole(u._id, e.target.value)}>
              <option value={"user"}>user</option>
              <option value={"organiser"}>organiser</option>
              <option value={"admin"}>admin</option>
             </select>

             <button onClick={()=>handleDelete(u._id)}
             className="bg-red-500 text-white px-2 py-1 mt-3 rounded">Delete user</button>
                </div>

        ))
     ) }
      
    </div>
  )
}

export default AdminUsers;
