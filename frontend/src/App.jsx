import "./App.css";
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Appointment from "./pages/Appointment.jsx";
import Teacher from "./pages/Teacher.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import AdminAddService from "./pages/AdminAddServices.jsx";
import AdminAddResource from "./pages/AdminAddResouces.jsx";
import ManageServices from "./pages/ManageServices.jsx";
import ManageResources from "./pages/ManageResources.jsx";

import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:category" element={<Services />} />
        <Route path="/appointment/:serviceId" element={<Appointment />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/admin-dashboard/add-service" element={<AdminAddService />} />
        <Route path="/admin-dashboard/add-resource" element={<AdminAddResource />} />
        <Route path="/admin-dashboard/service/:id" element={<ManageServices />} />
        <Route path="/admin-dashboard/resource/:id" element={<ManageResources />} />
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default App;
