// App.js
//import React from 'react';
import "./App.css";
//import HUB from "./HUB";
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
import Banner from "./Banner";
import Mappedin from "./mappedin";
import BuildingMap from "./leaflet1";
import Leaflet2 from "./leaflet2";
//INSTRUCCIONES
//npm create-react-app my-app (para instalar hay que crear, despues se borra)
// "npm start" para correr la pagina
// press (ctrl + c) para cerrar el server
//Si no tienes terminal, haz rightclick en package.json y dale a open para hacer los comandos correctos
//npm install react-router-dom  (esto es para poder navegar atravez de paginas)

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          {/* <Route exact path="/Hub" element={<HUB />} />{" "} */}
          {/*tengo "/" para que sea el default por el momento */}
         {/* <Route exact path="/home" element={<Home />} /> */} 
          <Route exact path="/" element={<Home />} />
          <Route exact path="/admin-home" element={<AdminHome />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/map" element={<Map />} />
          <Route exact path="/Events" element={<Events />} />
          <Route exact path="/About" element={<About />} />
          <Route exact path="/Account" element={<Account />} />
          <Route exact path="/maps2" element={<Maps2 />} />

          <Route exact path="/mappedin" element={<Mappedin/>} />
          <Route exact path="/leaflet1" element={<BuildingMap/>} />
          <Route exact path="/leaflet2" element={<Leaflet2/>} />

          {/* <Route exact path="/Schedule" element={<Schedule />} /> */}
        </Routes>
       {/*<Banner/> */}
      </div>
    </Router>
  );
}

export default App;
