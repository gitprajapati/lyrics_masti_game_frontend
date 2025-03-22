import React from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  if (!role) {
    navigate("/login");
    return null;
  }

  return (
    <div>
      {role === "admin" && <AdminDashboard />}
      {role === "permanent" && <UserDashboard />}
      {role === "temporary" && <UserDashboard />}
    </div>
  );
};

export default Home;
