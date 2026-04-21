import{createContext,useEffect,useState} from "react";
import API from "../api/axios";
export const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const[user,setUser]=useState(null)
    //loads user on refresh
  useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await API.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user || res.data);
    } catch (error) {
      setUser(null);
    }
  };

  fetchUser();
}, []);
    return (
        <AuthContext.Provider value={{user,setUser}}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider
