import React from "react";
import { Link } from "react-router-dom";
import indoors_icon from "./icons/Indoors_icon.png";
import outdoors_icon from "./icons/Outdoors_icon.png";
import events_icon from "./icons/Events_icon.png";
import users_icon from "./icons/Users_icon.png";
import "./admin-home2.css"; // Asegúrate de tener el archivo CSS correspondiente para el estilo de esta página

const AdminHome = () => {
  return (
    <div className="admin-home">
      <div className="tittle">
      <h1>Welcome, Admin!</h1>
      </div>
      <div className="options-container">
        <div className="option">
        <img src={indoors_icon} alt="Add/Edit Indoors" />
          <Link to="/View_indoors">
            <span>View/Edit Indoors</span>
          </Link>
          <Link to="/Admin_indoors">
            <span>Add Indoors</span>
          </Link>
        </div>
        <div className="option">
        <img src={outdoors_icon} alt="Add/Edit Outdoors" />
          <Link to="/View_outdoors">
            <span>View/Edit Outdoors</span>
          </Link>
          <Link to="/Admin-outdoors">
            <span>Add Outdoors</span>
          </Link>
          
        </div>
        <div className="option">
        <img src={events_icon} alt="Add/Edit Events" />
          <Link to="/View_events">
            <span>View/Edit Events</span>
          </Link>
          <Link to="/AdminEvents">
            <span>Add Events</span>
          </Link>
        </div>
        <div className="option">
          <Link to="/Admin-Users">
            <img src={users_icon} alt="Manage Users" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
