import React from 'react';
import './footer.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>Upra Interactive Guide</h3>
          <p>loh loboh papih</p>
        </div>
        <div className="footer-center">
          <h3>Frequent Actions</h3>
          <ul>
            {/*hacer botones*/}
            {/*<li>Map</li>*/}
            <Link className='link' to="/leaflet2">-Map</Link>
            <li></li>
            <Link className='link' to="/SignUp">-Sign up</Link>
            <li> </li>
            <Link className='link' to="/Events">-Events</Link>
           
          </ul>
        </div>
        <div className="footer-right">
          <h3>Contact Info</h3>
          <p>Email: upraguide@yahoo.com</p>
          <p>Phone: 787-123-4567</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
