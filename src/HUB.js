import "./HUB.css";
import "./header.css";
//import Home from './Home';
//import SignUp from './SignUp';
//import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; //Switch es Routes en v6
import {Link } from "react-router-dom"; //Switch es Routes en v6
//import logo from "./logo.svg";  lobo-upra_icon
import logo from "./images/lobo-upra_icon.png";
const HUB = () => {
  return (
    <div className="hub">
      <header className="Hub-header">
        <h1 className="Hub-title">Map HUB</h1>
        <h2>Welcome to the Hub!</h2>
        <img src={logo} className="App-logo" alt="logo" />

        <div className="hub-button-containter">
          <Link to="/leafletLC">
            <button className="pretty-button">Learning Commons ✅</button>
          </Link>

          <Link to="/leafletAC">
            <button className="pretty-button">AC 100 ⚠️</button>
          </Link>
          <Link to="/leafletAC2">
            <button className="pretty-button">AC 200 ⚠️</button>
          </Link>

          <Link to="/leafletCCOM">
            <button className="pretty-button">DEPT. CCOM/GTEC ✅</button>
          </Link>

          <Link to="/leafletCentroEst">
            <button className="pretty-button">Centro de Estudiantes ⚠️</button>
          </Link>

        </div>

      </header>
    </div>
  );
};

export default HUB;
