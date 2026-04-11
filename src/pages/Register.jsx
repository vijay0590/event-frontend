import { useState,useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
const Register=()=>{
    const [form,setForm]=useState({name:"",email:"",password:""});
    const[error,setError]=useState("");
    const{setUser}=useContext(AuthContext);
    const navigate=useNavigate();
   const handleChange=((e)=>{
    setForm({...form,[e.target.name]:e.target.value})
    });
    const handleSubmit=async (e)=>{
        e.preventDefault();
        try{
            const res=await API.post("/auth/register",form)
            //store token
            localStorage.setItem("token",res.data.token)
            //set user
            setUser(res.data.user);
            //redirect
            navigate("/");


        }catch(err){
            setError(err.response?.data?.message)
        }

    }

    return(
        <div className="flex justify-center items-center h-[80vh]">
            <form className="border p-5 w-80 space-y-3 rounded"
            onSubmit={handleSubmit}
            > {error && <p className="text-red-500">{error}</p>}

            <h1 className="text-2xl font-bold" >Register</h1>
            <input
            type="text"
            name="name"
            placeholder="Name..."
            className="border p-2 w-full"
            onChange={handleChange}
           />
           <input
           type="email"
           name="email"
           placeholder="Email..."
           className="border p-2 w-full"
           onChange={handleChange}
           />
           <input
           type="password"
           name="password"
           placeholder="Password..."
           className="border p-2 w-full"
           onChange={handleChange}
           />
           <button className="bg-blue-500 text-white w-full p-2 rounded">Register</button>

            </form>
        </div>
    )
}
export default Register;