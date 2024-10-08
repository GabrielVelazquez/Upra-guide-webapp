import React from 'react';
import './footer.css';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3>Upra Interactive Guide</h3>
          <p>Guia universitaria para facilitar la vida estudiantil.</p>
        </div>
        <div className="footer-center">
          <h3>Frequent Actions</h3>
          <ul>
            {/*hacer botones*/}
            {/*<li>Map</li>*/}
            <Link className='link' to="/leaflet2">-Map</Link>
            <li></li>
            <Link className='link' to="/Events">-Events</Link>
            <li> </li>
            <Link className='link' to="/About">-About</Link>
           
          </ul>
        </div>
        <div className="footer-right">
          <h3>Contact Info</h3>
          <p>Email: upraguide@upr.edu</p>
          <p>Phone: 787-555-2368</p> 
        </div>
      </div>
    </footer>
  );
}

export default Footer;
