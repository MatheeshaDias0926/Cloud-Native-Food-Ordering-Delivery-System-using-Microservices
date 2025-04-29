import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="user-details">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <p className="user-role">{user.role}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default UserProfile;
