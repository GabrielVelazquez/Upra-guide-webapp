// App.js
//import React from 'react';
import "./App.css";
import HUB from "./HUB";
import Home from "./Home";
import AdminHome from "./admin-home";
import SignUp from "./SignUp";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; //Switch es Routes en v6
import Header from "./header";
import Login from "./Login";
import Map from "./map";
import Events from "./Events";
import About from "./About";
import Account from "./Account";
import Maps2 from "./maps2";
//import Banner from "./Banner";
import Mappedin from "./mappedin";

//---------------------Interior maps-------------------------
import LearningCommons from "./Leaflet/LeafletJS/leafletLC";
import AC1  from "./Leaflet/LeafletJS/leafletAC";
import AC2  from "./Leaflet/LeafletJS/leafletAC2";
import CCOM from "./Leaflet/LeafletJS/LeafletCCOM";
import CentroEstudiantes from "./Leaflet/LeafletJS/leafletCentroEst";
//---------------------Interior maps-------------------------

import Leaflet2 from "./Leaflet/LeafletJS/leaflet2";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route exact path="/Hub" element={<HUB />} />{" "} */}
          {/*tengo "/" para que sea el default por el momento */}
         {/* <Route exact path="/home" element={<Home />} /> */} 
         
          {/*------------Navigation---------------*/}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/admin-home" element={<AdminHome />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/map" element={<Map />} />
          <Route exact path="/Events" element={<Events />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/Account" element={<Account />} />
          <Route exact path="/maps2" element={<Maps2 />} />

          {/*------------SALONES DE LEAFLET---------------*/}
          <Route exact path="/leafletLC" element={<LearningCommons/>} /> 
          <Route exact path="/leafletAC" element={<AC1/>} /> {/*AC nivel 1*/}
          <Route exact path="/leafletAC2" element={<AC2/>} /> {/*AC nivel 2*/}
          <Route exact path="/leafletCCOM" element={<CCOM/>} />  
          <Route exact path="/leafletCentroEst" element={<CentroEstudiantes/>} />

          {/*----------------TESTING------------------*/}
          <Route exact path="/mappedin" element={<Mappedin/>} />
          <Route exact path="/leaflet2" element={<Leaflet2/>} />

          {/*------------HUB---------------*/}import HUB from "./HUB";
          <Route exact path="/HUB" element={<HUB/>} /> 

          {/* <Route exact path="/Schedule" element={<Schedule />} /> */}
        </Routes>
       {/*<Banner/> */}
      </div>
    </Router>
  );
}

export default App;

//INSTRUCCIONES
//npm create-react-app my-app (para instalar hay que crear, despues se borra)
// "npm start" para correr la pagina
// press (ctrl + c) para cerrar el server
//Si no tienes terminal, haz rightclick en package.json y dale a open para hacer los comandos correctos
//npm install react-router-dom  (esto es para poder navegar atravez de paginas)