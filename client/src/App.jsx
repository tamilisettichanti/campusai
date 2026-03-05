import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Notices from "./pages/Notices";
import Notes from "./pages/Notes";
import Canteen from "./pages/Canteen";
import LostFound from "./pages/LostFound";
import AttendancePage from "./pages/AttendancePage";
import ChatPage from "./pages/ChatPage";
import Layout from "./components/Layout";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-screen"
      style={{ background: "var(--bg)" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500
          border-t-transparent rounded-full animate-spin mx-auto mb-4">
        </div>
        <p style={{ color: "var(--subtext)" }}>
          Working some backend magic... ✨
        </p>
      </div>
    </div>
  );
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>
        } />
        <Route path="/notices" element={
          <PrivateRoute><Layout><Notices /></Layout></PrivateRoute>
        } />
        <Route path="/notes" element={
          <PrivateRoute><Layout><Notes /></Layout></PrivateRoute>
        } />
        <Route path="/canteen" element={
          <PrivateRoute><Layout><Canteen /></Layout></PrivateRoute>
        } />
        <Route path="/lost-found" element={
          <PrivateRoute><Layout><LostFound /></Layout></PrivateRoute>
        } />
        <Route path="/attendance" element={
          <PrivateRoute><Layout><AttendancePage /></Layout></PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute><Layout><ChatPage /></Layout></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}