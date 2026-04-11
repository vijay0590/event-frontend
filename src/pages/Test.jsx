import { useEffect } from "react";
import API from "../api/axios";
const Test =()=>{
    useEffect(()=>{
        API.get("/events")
        .then((res)=>console.log(res.data))
        .catch((err)=>console.log(err))
    },[]);
    return <div>check consol</div>
}
export default Test;