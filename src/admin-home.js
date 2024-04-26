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

          {/*<Link className="admin-home-link" to="/View_indoors">
            <span>👁️✏️ View/Edit Indoors</span>
          </Link>
          */}

          <Link className="admin-home-link" to="/View_indoors">
            <button className="admin-home-button">👁️✏️ View/Edit Indoors</button>
            </Link>

          {/*<Link className="admin-home-link" to="/Admin_indoors">
            <span>➕ Add Indoors</span>
          </Link>
          */}

<Link className="admin-home-link" to="/Admin_indoors">
            <button className="admin-home-button">➕ Add Indoors</button>
            </Link>

        </div>
        <div className="option">
        <img src={outdoors_icon} alt="Add/Edit Outdoors" />
          
          {/*<Link className="admin-home-link" to="/View_outdoors">
            <span >👁️✏️ View/Edit Outdoors</span>
          </Link>

          <Link className="admin-home-link" to="/Admin-outdoors">
            <span>➕ Add Outdoors</span>
          </Link>
        */}
        <Link className="admin-home-link" to="/View_outdoors">
            <button className="admin-home-button">👁️✏️ View/Edit Outdoors</button>
            </Link>

            <Link className="admin-home-link" to="/Admin-outdoors">
            <button className="admin-home-button">➕ Add Outdoors</button>
            </Link>
          
        </div>
        <div className="option">
        <img src={events_icon} alt="Add/Edit Events" />
        
          {/*<Link className="admin-home-link" to="/View_events">
            <span>👁️✏️ View/Edit Events</span>
          </Link>

          <Link className="admin-home-link" to="/AdminEvents">
            <span >➕ Add Events</span>
          </Link>
      */}
       <Link className="admin-home-link" to="/View_events">
            <button className="admin-home-button">👁️✏️ View/Edit Events</button>
            </Link>

            <Link className="admin-home-link" to="/AdminEvents">
            <button className="admin-home-button">➕ Add Events</button>
            </Link>

        </div>
        <div className="option">
        <img src={users_icon} alt="Manage Users" />
          
          {/*<Link className="admin-home-link" to="/Admin-Users">
            <span >⚙️Manage Users</span>
          </Link>
    */}
     <Link className="admin-home-link" to="/Admin-Users">
            <button className="admin-home-button">⚙️Manage Users</button>
            </Link>

        </div>
      </div>
    </div>
  );
};

export default AdminHome;
