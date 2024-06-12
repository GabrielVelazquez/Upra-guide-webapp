//checkbox works but has lots of errors
//import {React} from "react";
/*import "./leaflet2.css";*/
// import "../LeafletCSS/leaflet2.css";
import "leaflet/dist/leaflet.css";
import "../LeafletCSS/leaflet2.css";
import "../LeafletCSS/leafletMap.css";

//import '../../maps2.css';

import { firestore,auth } from '../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';


import Modal from 'react-modal';
import React, { useState, useRef, useEffect } from "react";
import LocImgPH from "../../images/location_PlaceHolder_img.png";

import { useNavigate } from 'react-router-dom';

import {Routes, Route} from 'react-router-dom';
// import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Link } from 'react-router-dom';

import {customMarker, parkingMarker} from './LeafletIcons';  // marker custom
// import {parkingMarker} from './LeafletIcons';  // marker custom
import { Marker, Popup } from 'react-leaflet'; // Asegúrate de importar Marker y Popup

import { MapContainer, TileLayer } from "react-leaflet";

// import {RecenterButton, ResetButton}from './leafletui'; // Import RecenterButton 

import scuffed_close_button from "../../icons/scuffed_close_button.png";

Modal.setAppElement('#root'); //  root para accesar el modal

    const fetchData = async () => {
      try {
        const locationCollection = collection(firestore, 'location');
        const interiorCollection = collection(firestore, 'interior');

        const [locationSnapshot, interiorSnapshot] = await Promise.all([
          getDocs(locationCollection),
          getDocs(interiorCollection),
        ]);
  
        const locationMarkersArray = locationSnapshot.docs.map((doc) => {
          const markerData = doc.data();
          return [
            markerData.name, //0
            markerData.lat, //1
            markerData.lng, //2
            markerData.level, //3
            markerData.categoria,//4
            markerData.description, //5
            markerData.image, //6
            
            
          ];
        });

        const interiorMarkersArray = interiorSnapshot.docs.map((doc) => {
          const markerData = doc.data();
          return [
            markerData.name, //0
            markerData.lat, //1
            markerData.lng, //2
            //markerData.interiorArea,//3
            //markerData.leafletUrl//4
          ];
        });

        const combinedMarkersArray = [...locationMarkersArray, ...interiorMarkersArray];
        return combinedMarkersArray;
      } catch (error) {
        console.error('Error fetching markers: ', error); //si falla muestra error en consola
        //return {markersArray: [], exitMarkersArray: []};
        return[];
      }
    };

    

    export default function Intro() { //manda el read request
      const defaultPosition = { lat: 18.468435565260574, lng: -66.74114959255792 }; //mapa localizado en centro de upra
     
      const [centerPosition, setCenterPosition] = useState(defaultPosition);
      // const [ setCenterPosition] = useState(defaultPosition);

      const [selectedMarker, setSelectedMarker] = useState(null); //select a un marker

      const [searchValue, setSearchValue] = useState("");// nuevo estado para el valor de búsqueda
      const searchInputRef = useRef(null);// referencia al input de busqueda
      const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
      
      const [markers, setMarkers] = useState([]);
      const [dataFetched, setDataFetched] = useState(false); //recogio data de firestore
      const [interiorMarkers, setInteriorMarkers ]=useState([]);

      const [showInteriorSelect, setShowInteriorSelect] = useState(false); //muestra/esconde dropdown de sorting
      //const [showInteriorMarkers, setShowInteriorMarkers] = useState(false); // muestra markers o no
      const [showInteriorMarkers, setShowInteriorMarkers] = useState(
        localStorage.getItem("showInteriorMarkers") === "true" || false
      );

      const mapRef = useRef(null); // Reference to the map instance
      const navigate = useNavigate();

      // const [isChecked, setIsChecked] = useState(false);

      const [userLoggedIn, setUserLoggedIn] = useState(false);

      const [markerCheckStates, setMarkerCheckStates] = useState({});

      const handleCenterMap = () => {
        if (mapRef.current) {
          mapRef.current.setView([18.46899726783513, -66.7414733800247], 19); // centralizar el mapa y zoom level
        }
      };

// filtra markers segun el checkbox 
// const getFilteredMarkers = () => {
//   if (showInteriorMarkers) { //interiormarkercat???????????
// return interiorMarkers; //.filter((marker) => marker.length !== 4); // muestra interiorMarkers when checkbox is checked
//   //return filteredInteriorMarkersCat;


//   } else {
//     return filteredMarkersCat.filter((marker) => marker.length !== 3); // display los location markers when checkbox is unchecked
//   }
// };


useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      setUserLoggedIn(true);
      fetchData(); // llama a funcion: fetchData function si esta loged in
    } else {
      setUserLoggedIn(false);
      // si no esta loged in
    }
  });

  return () => {
    unsubscribe();
  };
}, []);

useEffect(() => {
  if (!dataFetched) {
    fetchData().then((markersArray) => {
      setMarkers(markersArray);
      // Separa interior markers del array
      const interiorMarkersArray = markersArray.filter((marker) => marker.length === 3);
      setInteriorMarkers(interiorMarkersArray);
      setDataFetched(true);
      console.log('fetched markers');
    });
  }
}, [dataFetched]);

  //Presionar Marker
  const handleMarkerClick = (marker) => { 
    setSelectedMarker(marker); 
    document.body.style.overflow = 'hidden';//scroll bar se esconde al entrar al modal (truco)
  };
  const closePopup = () => { // const closePopup = (index) => { //index para el recolor al normal
    setSelectedMarker(null);
    setSelectedMarkerIndex(null);//recolor a su color original despuse del search
    document.body.style.overflow = 'visible'; //scroll bar regresa everywhere cuando sale del mapa modal
  };


  // Funcion para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };


const handleSearch = () => {
  if (searchValue.trim() === "") {
    alert("Search empty");
    return;
  }

  const searchLowerCase = searchValue.toLowerCase();

  const foundMarker = markers.find((marker) => {
    const markerNameLower = marker[0].toLowerCase();
    return markerNameLower.includes(searchLowerCase);
  });

  if (foundMarker) {
    setCenterPosition({
      lat: parseFloat(foundMarker[1]),
      lng: parseFloat(foundMarker[2]),
    });
    setSearchValue("");
    setSelectedMarker(foundMarker); // Establecer el marcador seleccionado para abrir el modal
  } else {
    alert("No matching location found");
  }
};

//-----------------------------------Sort por location------------------------------------
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value || ""; 
    setSelectedCategory(newCategory);
    console.log("Filtered category:", newCategory);
    /*console.log("filter:", newCategory.categoria);*/
  };
  const filteredMarkersCat = selectedCategory
    ? markers.filter((marker) => marker[4] === selectedCategory)
    : markers;   


//-----------------------------------Sort por interior------------------------------------
  const [selectedInteriorCategory, setSelectedInteriorCategory] = useState("");
const handleInteriorCategoryChange = (event) => {
  const newInteriorCategory = event.target.value || "";
  setSelectedInteriorCategory(newInteriorCategory);
  console.log("Filtered category:", newInteriorCategory);
};

const filteredInteriorMarkersCat = selectedInteriorCategory
  ? interiorMarkers.filter((marker) => marker[0] === selectedInteriorCategory)
  : interiorMarkers;


  //-----------------------------------V enter en search V-----------------------------------
     const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    };

//-----------------------------------CHECKBOX------------------------------------
// Update handleCheckboxChange que hace toggle
const handleCheckboxChange = (event) => {
  
  setShowInteriorMarkers(event.target.checked);
  const checkbox =event.target;
  //const isChecked =checkbox.checked;
  const isChecked = event.target.checked;
    setShowInteriorMarkers(isChecked);
    localStorage.setItem("showInteriorMarkers", isChecked);

  if (isChecked) { //si activo
    console.log('Viewing Interiors');
    setShowInteriorSelect(true); //se ve el dropdown de interiores
//se puede hacer mas al ser activado aqui abajo
  } else {
    console.log('Viewing Locations');
    setShowInteriorSelect(false); //se esconde el drop down de interiores
    // mas acciones
  }

};

useEffect(() => {
  const storedState = localStorage.getItem("showInteriorMarkers");
  if (storedState !== null) {
    setShowInteriorMarkers(storedState === "true");
  }
}, []);

/*CERTIFY CHECBOX*/
const handleCheckboxChangecert = (event, markerName) => {
  const { checked } = event.target;
  setMarkerCheckStates(prevState => ({
    ...prevState,
    [markerName]: checked
  }));
  console.log('checked')
};

const renderMarkers = () => {
  let filteredMarkers;
  if (showInteriorMarkers) {
    filteredMarkers = filteredInteriorMarkersCat;
  } else {
    filteredMarkers = filteredMarkersCat.filter((marker) => marker.length !== 3);
  }

  /*---CHECKBOX-----------------------------------------------------------*/



  /* const handleCheckboxChange = (value) => {
    setIsChecked(value);
  };*/

/*
const handleCheckboxChange = (event) => { //ORIGINALBOXCHANGE
  setIsChecked(event.target.checked);
};
*/

/*const handleCheckboxChangecert = (event) => {
  setIsChecked(event.target.checked);
};*/



   /*---CHECKBOX-----------------------------------------------------------*/

  return filteredMarkers.map((marker, index) => {
    // const [name, lat, lng, level, description, image, categoria] = marker;
    const [name, lat, lng, level, categoria] = marker;
    console.log('categoria:', categoria);
    console.log('name:', name);
    
    if (categoria) { //componentes de markers para diferentes popups
      // Location Marker
      
      return (
        <Marker
          key={index}
          position={[lat, lng]}
          icon={categoria === 'Parkings' ? parkingMarker : customMarker}
          
          eventHandlers={{
        click: () => {
          handleMarkerClick(marker);
        },
          }}
        >
          <Popup>{name}</Popup>
        </Marker>
      );
    } else {
      // Interior Marker
      return (
        <Marker key={index} position={[lat, lng]} icon={customMarker}>
          <Popup>
            <div>
              <p className="textbox_text" >{name}</p>
              <button className="see-interior-button" onClick={() => handleInteriorMarkerClick(name)}>See Interior</button>
            
           

            </div>

{/*SO UGLY, FIXXXXXXXXXXXX*/}

{userLoggedIn && (
            <div className="certify-container">

            {/*//ORIGINALHANDLEBOXCHANGE
            <input
  className="certify-checkbox"
  type="checkbox"
  checked={isChecked} //cuando se marca
  onChange={handleCheckboxChange} // Use handleCheckboxChange function here
/>
*/}
<input
  className="certify-checkbox"
  type="checkbox"
  checked={markerCheckStates[name] || false}
/*onChange={(event) => handleCheckboxChange(event, name)} */ //ORIGINALHANDLEBOXCHANGE
  onChange={(event) => handleCheckboxChangecert(event, name)}
/>
            <div className="certify-box">
               Certificar la ruta de salida
            </div>
          </div>
)}
  {/*SO UGLY, FIXXXXXXXXXXXX  */}

          </Popup>

         
          

        </Marker>
      );
    }
  });
};

const handleInteriorMarkerClick = (name) => {
  console.log(`interior seleccionado: ${name}`); //deubbnig

    // chequea si el checkbox esta checked en el marker (del stackoverflow link)
    const isChecked = markerCheckStates[name] || false;

  if (isChecked) { //ve si esta checked
    console.log(`Certificar la ruta de salida para: ${name}`); // nombre del marker 
  }

  if (name === 'Learning Commons') { //name es igual al  Nombre de marker en firebase
    navigate('/leafletLC'); // va al js file llamado leafletLC
  } else if (name === 'AC 100 y 200') {
    navigate('/leafletAC'); // va al js file llamado leafletAC
  }

  /*else if (name === 'AC 200') {
    navigate('/leafletAC2'); // va al js file llamado leafletAC
  }
  */

  else if (name === 'Dept. CCOM/GTEC') {
    navigate('/LeafletCCOM'); 
  }
  else if (name === 'Centro de estudiantes') {
    navigate('/leafletCentroEst'); 
  }
  else if (name === 'Dept. Biol') {
    navigate('/leafletBIOL'); 
  }
  else if (name === 'CTI') {
    navigate('/leafletCTI'); 
  }
  else if (name === 'ISMUL') {
    navigate('/leafletISMUL'); 
  }
  else if (name === 'Cafeteria') {
    navigate('/leafletCafeteria'); 
  }
  else if (name === 'AC 217-220') {
    navigate('/leafletAC217to220'); 
  }
  else if (name === 'Decanato de estudiantes') {
    navigate('/leafletDecanatoEst');
  }
  else if (name === 'Dept. FISI/QUIMI & AC 231-237') {
    navigate('/leafletAC231'); 
  }
  else if (name === 'Anexos') {
    navigate('/leafletAnexos'); 
  }
  else if (name === 'Dept. Enfermeria') {
    navigate('/leafletDeptEnfe'); 
  }
  else if (name === 'Laboratorios de biologia') {
    navigate('/leafletLabBiol'); 
  }
  else if (name === 'Laboratorios de quimica') {
    navigate('/leafletLabQuim'); 
  }
  else if (name === 'AC 307-310') {
    navigate('/leafletAC307');
  }

  //else if (name === 'AC 307') {
  //  navigate('/leaflet307'); // va al js file llamado leafletAC
  //}

  else if (name === 'Dept. ESPA/MATE') {
    navigate('/leafletAC302'); 
  }
  //seguir a~nadiendo

};

     
    return ( 
      
            <div>

            {/* --------------------------------SEARCH BOX------------------------------------*/}
      
      
      <div className="search-bar">
      <input
  type="text"
  placeholder="Search..."
  value={searchValue}
  onChange={handleSearchChange}
  ref={searchInputRef}
  onKeyPress={handleKeyPress}
/>
        <button className="search-button" onClick={handleSearch}><img className="search-icon" src="https://cdn-icons-png.flaticon.com/256/3917/3917754.png" alt="Search" /></button>
      </div>
      
      {/*--------------------------------ACTUAL DROPDOWNBOXES------------------------------------*/}
   {showInteriorSelect ? (
        <div className="interior-select">
          <select id="name" onChange={handleInteriorCategoryChange} value={selectedInteriorCategory}>
            <option value="">All Interiors</option>
            {/*{[...new Set(interiorMarkers.map((marker) => marker[3]))].map((name) => (*/}
              {[...new Set(interiorMarkers.map((marker) => marker[0]))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="interior-select"> 
          <select id="categoria" onChange={handleCategoryChange} value={selectedCategory}>
            
            <option value="">All Locations</option>
            {[...new Set(markers.map((marker) => marker[4]))].map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      )}
      {/*category drop down WIP*/}

{/*CHECKBOX*/}

{/* --------------------------------ACTUAL SWITCH BOX------------------------------------*/}
<div className="custom-checkbox">
        <input id="status" type="checkbox" name="status" onChange={handleCheckboxChange} checked={showInteriorMarkers} />
        <label htmlFor="status">
          <div className="status-switch" data-unchecked="Locations" data-checked="Interiors"></div>
        </label>
      </div>  
      
{/* --------------------------------ACTUAL MAP------------------------------------*/}

        <MapContainer ref={mapRef} center={[18.46899726783518, -66.7414733800247]}  zoom={18}  
        //minZoom={16} maxZoom={20}
>
{/*I WANT THE CENTER OF THE IMAGE*/}
        {/*<h1 className="title-indoor">learning common</h1>*/}
        
        <TileLayer 
        minZoom={16} maxZoom={19} 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

        /*LEAFLET DEFAULT*/
        /*NO PERMITE 20 ZOOM*/
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

         /*GOOGLE FREE*/
         /*PERMITE 20 ZOOM*/
           /*url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}" */

         /*SATELLITTE*/
         /*NO PERMITE 20 ZOOM*/
         /*url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"*/

         /*url="https://maps.geoapify.com/v1/tile/osm-liberty/{z}/{x}/{y}.png" */
         /*url="mapbox://styles/gabidraco/clv4q670y02db01p63jnw0dt6?acces_token=pk.eyJ1IjoiZ2FiaWRyYWNvIiwiYSI6ImNsdjRubm5leDBhbTMyam51bGZkdmVuNjIifQ.XkAS-kYyXrOoPBRDj_J-3Q" */
        />

        {/*Button to center the map---------------------------------------------------------------------------------------------------*/}
<button className='recenter-button'
  //style={{position: 'absolute',top: '10px',right: '10px',zIndex: '1000',backgroundColor: 'transparent', border: 'none', cursor: 'pointer',}}
  onClick={handleCenterMap}
>
  <img
    src="https://cdn4.iconfinder.com/data/icons/maps-navigation-24/24/target_destination_current_location_place_focus_recenter-512.png"
    alt="Center Map"
    style={{ width: '30px', height: '30px' }} 
  />
</button>

       
<Routes>
      
        <Route element={<MapContainer ref={mapRef} center={[18.46899726783513, -66.7414733800247]} zoom={19} />}> {/*info del mapa */}

        </Route>
      </Routes>
       
{/*category drop down WIP*/}


{/*-----------------------------------------------------MODAL------------------------------------------------------------*/}
<Modal className="modal-box"
        isOpen={selectedMarker !== null}
        onRequestClose={closePopup}
        contentLabel="Marker Information Modal"
        style={{ overlay: { zIndex: 3 }, content: { zIndex: 3 } }}
      >
        {selectedMarker && (
          
          <div>
            <div className="modal-box-top ">
            {/*<Link className="modal-exit" onClick={closePopup}>Exit</Link> */}{/*Exit*/}
            <Link className="modal-exit" onClick={closePopup}>
            <img
            style={{ width: '40px', height: '40px' }}
              src={scuffed_close_button}
              alt="Exit"
            />
            </Link>
           
              <p className="location-title">{selectedMarker[0]}</p>
            </div>
            <img
  className="location-img"
  src={selectedMarker[6] !== "" ? selectedMarker[6] : LocImgPH} alt={selectedMarker[6] !== "" ? selectedMarker[0] : "LocImgPH"} /> {/*Imagen*/}
            <hr className='hr-modal ' />
            <p className="location-info-text">{selectedMarker[3]}</p>{/*Nivel*/}
            <p className="location-info-text">{selectedMarker[5]}</p>{/*Descripcion*/}
            <div className="modal-exit">
             
            </div>
          </div>
        )}
      </Modal>
      {renderMarkers()}
        </MapContainer>
        </div>
      
     
    );
        }