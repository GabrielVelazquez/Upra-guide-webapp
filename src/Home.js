import { React, useEffect , useState} from "react";
import "./Home.css";
//import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {  Link } from "react-router-dom";
import { auth } from "./firebase.config";
import map_icon from "./icons/Map_icon.png";
import events_icon from "./icons/Events_icon.png";
import account_icon from "./icons/Account_icon.png";
import schedule_icon from "./icons/Schedule_icon.png";

import upra_icon from "./icons/Upra_img.jpg";
import portal_icon from "./icons/Portal_img.png";
import cursos_icon from "./icons/CursosUpra_img.jpg";
import Footer from "./footer";
const Home = () => {
  document.body.style.overflow = 'visible'; //scroll siempre, evita bug saliendo del modal
  //const location = useLocation();
  //const { state } = location;
  const [hugeImage, setHugeImage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Usuario autenticado:", user.uid);
        // Aquí podrías realizar otras acciones con el usuario autenticado
      } else {
        console.log("No hay usuario autenticado");
        hideContainers();
      }
    });

    const images = [
      "https://www.periodicovision.com/wp-content/uploads/2023/09/UPRA.jpeg",
      "https://bloximages.newyork1.vip.townnews.com/elvocero.com/content/tncms/assets/v3/editorial/0/1a/01afb4e6-78b0-11e8-912d-5757fd62603a/5b3145e20d790.image.jpg?resize=600%2C400.jpg",
      /*la larga "https://scontent.fsju2-1.fna.fbcdn.net/v/t39.30808-6/291493255_556852399167251_5688320262611426894_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=LqhaT-iVoSoAb49IpD-&_nc_ht=scontent.fsju2-1.fna&oh=00_AfBVvaWNMu7YedSvMifQVpQ2sjWllX1eP97s7UVjE_rAiw&oe=66363846",*/
      "https://dialogo.upr.edu/wp-content/uploads/2015/04/a9e01df2a93701f6934ec72096282063.jpg",
      "https://www.primerahora.com/resizer/YTbCdGggIBA22g7ioaNqHc56RXU=/930x0/smart/filters:quality(75):format(jpeg)/cloudfront-us-east-1.images.arcpublishing.com/gfrmedia/XGV6A2GNNZHVLFSBBBPDAZEISA.jpg",
      "//upra.edu/wp-content/uploads/2022/02/WhatsApp-Image-2022-02-03-at-9.04.09-AM.jpeg"
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    setHugeImage(images[randomIndex]);

    // Para detener la escucha de cambios de autenticación cuando el componente se desmonta
    return () => {
      unsubscribe();
    };
  }, []);
  

  const hideContainers = () => {
    const imageContainers = document.querySelectorAll(".image-container2");
    for (const imageContainer of imageContainers) {
      imageContainer.style.display = "none";
      console.log("Should be hidden");
    }
  };
  
    /*PARA DEBUGGING */
  
  const handleImageClick = (imageLabel) => {
    // alert(`Navegara a ${imageLabel}`);
  };

  return (
    <div className="home">
      <div className="Huge-image-container">
        <div className="Huge-Image">
          <img
           // src="https://www.periodicovision.com/wp-content/uploads/2023/09/UPRA.jpeg"
            src={hugeImage}
            alt="UPRA Recinto"
          />
        </div>
      </div>

      <hr/>

      {/* botones que los links son parte del web app (paginas internas) */}
   
      <div className="image-container">

        <div
          className="image pressable-image"
          onClick={() => handleImageClick("Maps")}>
                  <h1 className="image-title" > Map </h1>
          <Link to="/leaflet2">
             {/*<Link to="/maps2">*/}
            <img
              src={map_icon}
              alt="Map"
            />
          </Link>
        </div>

        <div
          className="image pressable-image"
          onClick={() => handleImageClick("Events")}>
            <h1 className="image-title" > Events </h1>
          <Link to="/Events">
            {" "}
            {/*Link dentro del div de pressable image para que responda*/}
            <img
              src={events_icon}
              alt="Events"
            />
          </Link>
        </div>
      </div>

      <div className="image-container2">
        <div
          className="image pressable-image"
          onClick={() => handleImageClick("Account")}>
            <h1 className="image-title" > Account </h1>
          <Link to="/account">
            {" "}
            {/*Link dentro del div de pressable image para que responda*/}
            <img
              src={account_icon}
              alt="Account"
            />
          </Link>
        </div>

        <div
          className="image pressable-image"
          onClick={() => handleImageClick("Schedule")}>
            <h1 className="image-title" > Schedule </h1>
          <Link to="/Account">
            {" "}
            {/*Link dentro del div de pressable image para que responda*/}
            <img
              src={schedule_icon}
              alt="Schedule"
            />
          </Link>
        </div>
      </div>

      {/*test de button source* /}
                                  <div className="image-container">
                                  <Link to="/">
                                      <div className="image pressable-image"> 
                                      <img src="https://cdn3.emoji.gg/emojis/7215_thonk.png" alt="Map" />
                                      </div>
                                    </Link>
                                    </div>
                          {/ *test de button source*/}

      {/* Viejo boton de prueba
        <div className="image pressable-image" onClick={() => handleImageClick("Image 2")}>
          <img src="https://cdn-icons-png.flaticon.com/512/566/566987.png" alt="Events" />
        </div>
                        */}

      {/* Linea que divide */}
        <hr />

       <h1 className="home-services">Other services </h1>

        {/*  botones que los links no son parte del web app (paginas externas) */}
        <div className="image-container">
        <a className="image pressable-image" href="https://upra.edu/">
          <h1 className="link-text">UPRA</h1>
          <img
            src={upra_icon }
            alt="Upra"
          />
        </a>

        <a className="image pressable-image" href="https://portal.upr.edu/">
          <h1 className="link-text">Portal</h1>
          <img
            src={portal_icon }
            alt="Portal"
          />
        </a>

        <a className="image pressable-image" href="https://cursos.upra.edu/">
          <h1 className="link-text">Moodle</h1>
          <img
            src={cursos_icon }
            alt="Moodle"
          />
        </a>
      </div>
        <Footer/>
    </div>
  );

};

// function hideContainers(auth) {
//   console.log("inside hideContainer:", auth);
//   if (!auth) {
//     const imageContainers = document.querySelectorAll(".image-container2");
//     for (const imageContainer of imageContainers) {
//       imageContainer.style.display = "none";
//       console.log("Should be hidden");
//     }
//   }
// }

export default Home;
