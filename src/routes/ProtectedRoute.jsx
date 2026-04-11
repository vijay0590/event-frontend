import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
const ProtectedRoute=({children})=>{
    const {user}=useContext(AuthContext);
    //not logged in
    if(!user){
        return <Navigate to ="/login"/>;
    }
    //role check
    if(role&&user.role !== role){
        return <Navigate to="/"/>;
    }
    return children;

}
export default ProtectedRoute