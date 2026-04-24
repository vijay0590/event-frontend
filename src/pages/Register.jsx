import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Register = () => {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleChange = ((e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    });
    const [loading, setLoading] = useState(false)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.post("/api/auth/register", form)
            //store token
            localStorage.setItem("token", res.data.token)
            //set user
            setUser(res.data.user);
            toast.success("Registration successful")
            //redirect
            navigate("/");


        } catch (err) {
            toast.error(err.response?.data?.message || "Register failed")
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 w-full max-w-sm">

                {/* TITLE */}
                <h2 className="text-2xl font-semibold text-gray-900 text-center mb-1">
                    Create Account
                </h2>

                <p className="text-sm text-gray-500 text-center mb-6">
                    Join EventX and start exploring
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                        className="border border-gray-200 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

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
                        {loading ? "Registering..." : "Register"}
                    </button>

                </form>

                {/* LOGIN LINK */}
                <p className="text-sm text-center text-gray-500 mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-600 hover:underline">
                        Login
                    </a>
                </p>

            </div>

        </div>
    );
}
export default Register;