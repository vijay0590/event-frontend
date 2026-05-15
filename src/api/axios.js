import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ===== REQUEST INTERCEPTOR (Outgoing) =====
API.interceptors.request.use(
    (req) => {
        const token = localStorage.getItem("token");
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
        return req;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ===== RESPONSE INTERCEPTOR (Incoming) =====
API.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
        // If the backend returns 401 (Unauthorized/Expired Token)
        if (error.response && error.response.status === 401) {
            console.warn("Session expired. Logging out...");
            
            // Clear local credentials
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Optional: Redirect to login if not already there
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default API;