import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop"; // Recommended addition

// Auth Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// User Pages
import MyTickets from "./pages/MyTickets";
import EventDetails from "./pages/EventDetails";

// Organiser Pages
import Organiser from "./pages/Organiser";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import EditEvent from "./pages/EditEvent";
import Attendees from "./pages/Attendees";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminUsers from "./pages/AdminUsers";
import AdminTransactions from "./pages/AdminTransactions";

// Protection
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      {/* Resets scroll position on every navigation */}
      <ScrollToTop /> 
      
      <MainLayout>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/event/:id" element={<EventDetails />} />

          {/* SHARED PROTECTED ROUTES (Any logged in user) */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* USER ONLY ROUTES */}
          <Route path="/my-tickets" element={
            <ProtectedRoute role="user">
              <MyTickets />
            </ProtectedRoute>
          } />

          {/* ORGANISER ONLY ROUTES */}
          <Route path="/organiser-dashboard" element={
            <ProtectedRoute role="organiser">
              <Organiser />
            </ProtectedRoute>
          } />
          <Route path="/create-event" element={
            <ProtectedRoute role="organiser">
              <CreateEvent />
            </ProtectedRoute>
          } />
          <Route path="/my-events" element={
            <ProtectedRoute role="organiser">
              <MyEvents />
            </ProtectedRoute>
          } />
          <Route path="/attendees/:id" element={
            <ProtectedRoute role="organiser">
              <Attendees />
            </ProtectedRoute>
          } />

          {/* MIXED PERMISSION ROUTES (Organiser or Admin) */}
          <Route path="/edit-event/:id" element={
            <ProtectedRoute role={["organiser", "admin"]}>
              <EditEvent />
            </ProtectedRoute>
          } />

          {/* ADMIN ONLY ROUTES */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-events" element={
            <ProtectedRoute role="admin">
              <AdminEvents />
            </ProtectedRoute>
          } />
          <Route path="/admin-users" element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin-transactions" element={
            <ProtectedRoute role="admin">
              <AdminTransactions />
            </ProtectedRoute>
          } />

          {/* 404 CATCH-ALL (Optional but good practice) */}
          <Route path="*" element={
            <div className="min-h-[60vh] flex items-center justify-center font-black text-gray-300 text-4xl">
              404 | NOT FOUND
            </div>
          } />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
};

export default App;