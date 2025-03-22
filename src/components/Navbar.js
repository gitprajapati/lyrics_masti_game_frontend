import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You are already logged out.");
        navigate("/login");
        return;
      }

      await axios.delete("http://127.0.0.1:5000/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to communicate with server. Logging out locally.");
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      setIsLoggedIn(false); // Update state to hide navbar immediately
      navigate("/login");
    }
  };

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img
            src="/song-lyrics.png"
            alt="Logo"
            width="30"
            height="30"
            className="d-inline-block align-text-top me-2"
          />
          Home
        </Link>
        <form className="d-flex" role="search">
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
