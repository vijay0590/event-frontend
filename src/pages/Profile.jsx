import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

const Profile = () => {
    const {user}=useContext(AuthContext)
   if (!user) return <p>loading...</p>


  return (
    <div className="max-w.md max-auto p-5">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>
     <div className="border p-4 rounded space-y-2">
         <p><b>Name:</b>{user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Role: </b>{user.role}</p>
     </div>
    </div>
  )
}

export default Profile
