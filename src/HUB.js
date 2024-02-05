/* import "./HUB.css";
import "./header.css";
//import Home from './Home';
//import SignUp from './SignUp';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; //Switch es Routes en v6
import logo from "./logo.svg";
const HUB = () => {
  return (
    <div className="hub">
      <header className="Hub-header">
        <a className="Hub-title">The start of UPRA GUIDE</a>
        <h2>Welcome to the Hub!</h2>
        <img src={logo} className="App-logo" alt="logo" />

        <div className="hub-button-containter">
          <Link to="/home">
            <button className="pretty-button">Go to Home</button>
          </Link>

          <Link to="/signup">
            <button className="pretty-button">Go to Sign Up</button>
          </Link>

          <Link to="/login">
            <button className="pretty-button">Go to Login</button>
          </Link>

          <Link to="/events">
            <button className="pretty-button">Go to Events</button>
          </Link>

          <Link to="/map">
            <button className="pretty-button">Go to Map</button>
          </Link>

          <Link to="/account">
            <button className="pretty-button">Go to Account</button>
          </Link>

          <Link to="/about">
            <button className="pretty-button">Go to About</button>
          </Link>

          <Link to="/maps2">
            <button className="pretty-button">Go to Map 2</button>
          </Link>

          <Link to="/admin-home">
            <button className="pretty-button">Go to Add Location</button>
          </Link>

        </div>
      </header>
    </div>
  );
};

export default HUB;
*/