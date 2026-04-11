import{ BrowserRouter,Routes,Route} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Test from "./pages/Test"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyTickets from "./pages/MyTickets";
import CreateEvent from "./pages/CreateEvent";
import AdminDashboard from "./pages/AdminDashboard";


const App = () => {
  return (
  <BrowserRouter>
  <MainLayout>
  <Routes>
    
         <Route path="/" element={<Home/>}></Route>
         <Route path="/login" element={<Login/>}></Route>
         <Route path="/register" element={<Register/>}></Route>
   {/*user*/}
         <Route path="/my-tickets" element={
          <ProtectedRoute role="user">
          <MyTickets/>
          </ProtectedRoute>
        }/>
     {/*organiser*/}
    <Route path="/create-event" element={
          <ProtectedRoute role="organiser">
          <CreateEvent/>
          </ProtectedRoute>
        }/>
    
      {/*admin*/}
    
    <Route path="/admin" element={
          <ProtectedRoute role="admin">
          <AdminDashboard/>
          </ProtectedRoute>
        }/>

  </Routes>
  </MainLayout>
  </BrowserRouter>
  )
}

export default App;

