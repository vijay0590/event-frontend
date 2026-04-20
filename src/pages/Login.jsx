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


    return(
        <div className="flex justify-center items-center h-[80vh]">
            <form 
            className="border p-5 w-80 space-y-3 rounded"
            onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-2">Login</h2>
                <input
                type="email"
                name="email"
                placeholder="email"
                className="border p-2 w-full"
                onChange={handleChange}
                 />
                
                <input
                type="password"
                name="password"
                placeholder="password"
                className="border p-2 w-full"
                onChange={handleChange}
                 />
                
                <button 
              disabled={loading}
                className="bg-blue-500 text-white p-2 w-full rounded">
                    {loading?"logging in...":"Login"}
                    </button>
            </form>
        </div>
    )
}
export default Login