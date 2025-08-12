import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import About from "./pages/About";
import AllDoctors from "./pages/AllDoctors";
import Doctor from "./pages/Doctor";
import MyProfile from "./pages/MyProfile";
import MyAppointment from "./pages/MyAppointment";
import Appointment from "./pages/Appointment";
import Header from "./components/Header";
import TopDoctors from "./components/TopDoctors";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctors from "./pages/AdminDoctors";
import AdminAddDoctor from "./pages/AdminAddDoctor";
import AdminAppointments from "./pages/AdminAppointments";
import AdminPatients from "./pages/AdminPatients";
import AdminOverview from "./pages/AdminOverview";

const AdminRoute = ({ children }) => {
  const { isAdmin } = useContext(AppContext);
  // if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top-doctors" element={<TopDoctors />} />
        <Route path="/doctors" element={<AllDoctors />} />
        <Route path="/doctors/:speciality" element={<Doctor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointment />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/overview"
          element={
            <AdminRoute>
              <AdminOverview />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <AdminRoute>
              <AdminDoctors />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/doctors/new"
          element={
            <AdminRoute>
              <AdminAddDoctor />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <AdminRoute>
              <AdminAppointments />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <AdminRoute>
              <AdminPatients />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
