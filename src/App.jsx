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
import EventPages from "./pages/EventPages";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";
import Attendees from "./pages/Attendees";
import Organiser from "./pages/Organiser";
import AdminEvents from "./pages/AdminEvents";




const App = () => {
  return (
  <BrowserRouter>
  <MainLayout>
  <Routes>
    
         <Route path="/" element={<Home/>}></Route>
         <Route path="/login" element={<Login/>}></Route>
         <Route path="/register" element={<Register/>}></Route>
         <Route path="/events/:id" element={<EventPages/>}/>
         <Route path="/edit-event/:id" element={<EditEvent />} />
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
    <Route path="/my-events" element={
      <ProtectedRoute role="organiser">
        <MyEvents/>
      </ProtectedRoute>
    }/>
    <Route path="/attendees/:id" element={
<ProtectedRoute role="organiser">
  <Attendees/>
</ProtectedRoute>
 }/>
 <Route path="/organiser-dashboard" element={
 <ProtectedRoute>
 <Organiser/>
 </ProtectedRoute>
 }
 />
      {/*admin*/}
    
    <Route path="/admin" element={
          <ProtectedRoute role="admin">
          <AdminDashboard/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-events" element={
          <ProtectedRoute>
            <AdminEvents/>
          </ProtectedRoute>
        }
        />

  </Routes>
  </MainLayout>
  </BrowserRouter>
  )
}

export default App;

