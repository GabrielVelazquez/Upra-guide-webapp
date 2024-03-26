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

        <Link to="/leaflet2">
            <button className="pretty-button">Mapa Leaflet 📌</button>
          </Link>

          <Link to="/leafletLC">
            <button className="pretty-button">Learning Commons ✅</button>
          </Link>

          <Link to="/leafletAC">
            <button className="pretty-button">AC 100 ✅</button>
          </Link>
          <Link to="/leafletAC2">
            <button className="pretty-button">AC 200 ✅</button>
          </Link>

          <Link to="/leafletCCOM">
            <button className="pretty-button">DEPT. CCOM/GTEC ✅</button>
          </Link>

          <Link to="/leafletCentroEst">
            <button className="pretty-button">Centro de Estudiantes ⚠️</button>
          </Link>

          <Link to="/leafletCTI">
            <button className="pretty-button">CTI ✅</button>
          </Link>

          <Link to="/leafletBIOL">
            <button className="pretty-button">BIOL ✅</button>
          </Link>

          <Link to="/leafletISMUL">
            <button className="pretty-button">ISMUL ✅</button>
          </Link>

          <Link to="/leafletCafeteria">
            <button className="pretty-button">Cafeteria ⚠️</button>
          </Link>
         

          <Link to="/leafletAC217to220">
            <button className="pretty-button">AC 217-220 ❌</button>
          </Link>
          
          <Link to="/leafletDecanatoEst">
            <button className="pretty-button">Decanato Estudiantes ❌</button>
          </Link>

          <Link to="/leafletAC231">
            <button className="pretty-button">AC231 ✅</button>
          </Link>
          
          <Link to="/leafletAnexos">
            <button className="pretty-button">Anexos ✅</button>
          </Link>
          
          <Link to="/leafletDeptEnfe">
            <button className="pretty-button">Departamento de enfermeria ❌</button>
          </Link>

          <Link to="/leafletLabBiol">
            <button className="pretty-button">Laboratorios de Biologia ✅</button>
          </Link>

          <Link to="/leafletLabQuim">
            <button className="pretty-button">Laboratorios de Quimica ✅</button>
          </Link>


        </div>

      </header>
    </div>
  );
};

export default HUB;
