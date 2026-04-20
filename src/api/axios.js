import axios from "axios";
const API =axios.create({
    baseURL:"https://online-6fl3.onrender.com"
});
//attach token automatically
API.interceptors.request.use((req)=>{
    const token=localStorage.getItem("token");
    if(token){
        req.headers.Authorization=`Bearer ${token}`;
    }
    return req;
});
export default API;
