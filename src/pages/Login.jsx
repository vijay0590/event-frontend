import { useState,useContext } from "react"
import API from "../api/axios"
import { AuthContext } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

const Login=()=>{
    const [form,setForm]=useState({email:"",password:""});
    const {setUser}=useContext(AuthContext);
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate();
    const handleChange=(e)=>{
        setForm({...form,[e.target.name]:e.target.value})

    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setLoading(true);
        try{
            const res=await API.post("api/auth/login",form)
            //store token
            localStorage.setItem("token",res.data.token)
            //setUser
            setUser(res.data.user)
            
            toast.success("login successful")
            
            //redirect
           navigate("/");

           }catch(err){
            toast.error(err.response?.data?.message||"login failed");

        }finally{
            setLoading(false);
        }


    }

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 w-full max-w-sm">

      {/* LOGO / TITLE */}
      <h2 className="text-2xl font-semibold text-gray-900 text-center mb-1">
        Welcome Back
      </h2>

      <p className="text-sm text-gray-500 text-center mb-6">
        Login to your account
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        <button
          disabled={loading}
          className="bg-indigo-600 text-white py-2 w-full rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>

  </div>
);
}
export default Login