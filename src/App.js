// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; //Switch es Routes en v6

import "./App.css";
import HUB from "./HUB";
import Home from "./Home";
import AdminHome from "./admin-home";
import SignUp from "./SignUp";
//import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; //Switch es Routes en v6
import Header from "./header";
import Login from "./Login";
import Map from "./map";
import Events from "./Events";
import About from "./About";
import Account from "./Account";
import Maps2 from "./maps2";
//import Banner from "./Banner";
//import Mappedin from "./mappedin";

//---------------------Interior maps-------------------------
import LearningCommons from "./Leaflet/LeafletJS/leafletLC";
import AC1  from "./Leaflet/LeafletJS/leafletAC";
import AC2  from "./Leaflet/LeafletJS/leafletAC2";
import CCOM from "./Leaflet/LeafletJS/LeafletCCOM";
import CentroEstudiantes from "./Leaflet/LeafletJS/leafletCentroEst";
import BIOL from "./Leaflet/LeafletJS/leafletBIOL";
import CTI from "./Leaflet/LeafletJS/leafletCTI";
import ISMUL from "./Leaflet/LeafletJS/leafletISMUL";
import Cafeteria from "./Leaflet/LeafletJS/leafletCafeteria";
import AC217220 from "./Leaflet/LeafletJS/leafletAC217to220";
import Decanato from "./Leaflet/LeafletJS/leafletDecanatoEst";
import AC231 from "./Leaflet/LeafletJS/leafletAC231";
import Anexos from "./Leaflet/LeafletJS/leafletAnexos";
import DeptEnfermeria from "./Leaflet/LeafletJS/leafletDeptEnfe";
import LabBiol from "./Leaflet/LeafletJS/leafletLabBiol";
import LabQuim from "./Leaflet/LeafletJS/leafletLabQuim";
import AdminOutdoors from "./Admin-outdoors";
import AdminUsersPage from "./Admin-Users";
import AdminEvents from "./AdminEvents";
import AdminIndoors from "./Admin_indoors";
import AC307 from "./Leaflet/LeafletJS/leafletAC307";
import AC302 from "./Leaflet/LeafletJS/leafletAC302";
import ViewIndoors from "./View_indoors";
import ViewOutdoors from "./View_Outdoors";
import ViewEvents from "./View_events";
//---------------------Interior maps-------------------------

import Leaflet2 from "./Leaflet/LeafletJS/leaflet2";


function App() {
  {/*const [isAdmin, setIsAdmin] = useState(false);*/}
  const isAdminStored = localStorage.getItem('isAdmin') === 'true'; //valor local
  const [isAdmin, setIsAdmin] = useState(isAdminStored); //valor de isAdmin lo coge del local

  useEffect(() => {
    const isAdminStored = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(isAdminStored);
  }, []); // ve el valor de admin actual

  //Handlelogout
  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.setItem('isAdmin', 'false'); // valor local es falso (no es admin)
  };

  return (
    <Router>
      <div className="App">
        {/*<Header setIsAdmin={setIsAdmin}/>*/}
        <Header setIsAdmin={setIsAdmin} handleLogout={handleLogout} isAdmin={isAdmin}/>
        

        <Routes>
          {/* <Route exact path="/Hub" element={<HUB />} />{" "} */}
          {/*tengo "/" para que sea el default por el momento */}
         {/* <Route exact path="/home" element={<Home />} /> */} 
         
          {/*------------Navigation---------------*/}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/signup" element={<SignUp setIsAdmin={setIsAdmin} />} />
          <Route exact path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
          <Route exact path="/map" element={<Map />} />
          <Route exact path="/Events" element={<Events />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/Account" element={<Account />} />
          <Route exact path="/maps2" element={<Maps2 />} />

           {/*------------Admin---------------*/}
           {isAdmin && (
            <>
          <Route exact path="/admin-home" element={<AdminHome/>} />
          <Route exact path="/Admin-outdoors" element={<AdminOutdoors/>}/>
          <Route exact path="/Admin-Users" element={<AdminUsersPage/>}/>
          <Route exact path="/AdminEvents" element={<AdminEvents/>}/>
          <Route exact path="/Admin_Indoors" element={<AdminIndoors/>}/>
          <Route exact path="/View_Indoors" element={<ViewIndoors/>}/>
          <Route exact path="/View_Outdoors" element={<ViewOutdoors/>}/>
          <Route exact path="/View_Events" element={<ViewEvents/>}/>
         
          </>
          )}
          {/*------------SALONES DE LEAFLET---------------*/}
          <Route exact path="/leafletLC" element={<LearningCommons/>} /> 
          <Route exact path="/leafletAC" element={<AC1/>} /> {/*AC nivel 1*/}
          <Route exact path="/leafletAC2" element={<AC2/>} /> {/*AC nivel 2*/}
          <Route exact path="/leafletCCOM" element={<CCOM/>} />  
          <Route exact path="/leafletCentroEst" element={<CentroEstudiantes/>} />
          <Route exact path="/leafletBIOL" element={<BIOL/>} />
          <Route exact path="/leafletCTI" element = {<CTI/>}/>
          <Route exact path="leafletISMUL" element={<ISMUL/>}/>
          <Route exact path="leafletCafeteria" element={<Cafeteria />}/>
          <Route exact path="leafletAC217to220" element={<AC217220 />}/>
          <Route exact path="leafletDecanatoEst" element={<Decanato />}/>
          <Route exact path="leafletAC231" element={<AC231/>}/>
          <Route exact path="leafletAnexos" element={<Anexos/>}/>
          <Route exact path="leafletDeptEnfe" element={<DeptEnfermeria/>}/>
         <Route exact path="leafletLabBiol" element={<LabBiol/>}/>
         <Route exact path="leafletLabQuim" element={<LabQuim/>}/>
         <Route exact path="leafletAC307" element={<AC307/>}/>
         <Route exact path="leafletAC302" element={<AC302/>}/>
          {/*----------------TESTING------------------*/}
         {/*<Route exact path="/mappedin" element={<Mappedin/>} />*/}
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