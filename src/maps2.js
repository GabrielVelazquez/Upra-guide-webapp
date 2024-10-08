//hides with working category, doesnt show idoor markers yet
import React, { useState, useRef, useEffect } from "react";
import Modal from 'react-modal';
import { APIProvider, Map, AdvancedMarker, Pin  } from "@vis.gl/react-google-maps";
import { Link } from 'react-router-dom';
import './maps2.css';
import { firestore } from './firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import LocImgPH from "./images/location_PlaceHolder_img.png";


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
            markerData.description, //4
            markerData.image, //5
            markerData.categoria,//6 
          ];
        });

        const interiorMarkersArray = interiorSnapshot.docs.map((doc) => {
          const markerData = doc.data();
          return [
            markerData.name, //0
            markerData.lat, //1
            markerData.lng, //2
            markerData.interiorArea,//3
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

      const [selectedMarker, setSelectedMarker] = useState(null); //select a un marker

      const [searchValue, setSearchValue] = useState("");// nuevo estado para el valor de búsqueda
      const searchInputRef = useRef(null);// referencia al input de busqueda
      const [selectedMarkerIndex, setSelectedMarkerIndex] = useState(null);
      
      const [markers, setMarkers] = useState([]);
      const [dataFetched, setDataFetched] = useState(false); //recogio data de firestore
      const [interiorMarkers, setInteriorMarkers ]=useState([]);

      const [showInteriorSelect, setShowInteriorSelect] = useState(false); //muestra/esconde dropdown de sorting
      const [showInteriorMarkers, setShowInteriorMarkers] = useState(false); // Flag to show/hide interior markers
      
// filtra markers segun el checkbox 
const getFilteredMarkers = () => {
  if (showInteriorMarkers) { //interiormarkercat???????????
    return interiorMarkers; //.filter((marker) => marker.length !== 4); // muestra interiorMarkers when checkbox is checked
  } else {
    return filteredMarkersCat.filter((marker) => marker.length !== 4); // Display los location markers when checkbox is unchecked
  }
};


useEffect(() => {
  if (!dataFetched) {
    fetchData().then((markersArray) => {
      setMarkers(markersArray);
      // Separate interior markers from the combined array
      const interiorMarkersArray = markersArray.filter((marker) => marker.length === 4);
      setInteriorMarkers(interiorMarkersArray);
      setDataFetched(true);
      console.log('fetched markers');
    });
  }
}, [dataFetched]);

  //Presionar Marker
  const handleMarkerClick = (marker) => { 
    setSelectedMarker(marker); 
    document.body.style.overflow = 'hidden';
    //setSelectedMarkerIndex(index);//recolor
  };
  const closePopup = () => { // const closePopup = (index) => { //index para el recolor al normal
    setSelectedMarker(null);
    setSelectedMarkerIndex(null);//recolor a su color original despuse del search
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

//Función para buscar y seleccionar un marcador según el texto de búsqueda
const handleSearch = () => {
  if (searchValue.trim() === "") {
    alert("Search empty");
    return;
  }

  const searchLowerCase = searchValue.toLowerCase();

  let filteredMarkersForSearch = markers;

  if (selectedCategory) {
    // If a category is selected, filter markers by category
    filteredMarkersForSearch = markers.filter((marker) => marker[6] === selectedCategory);
    setSelectedMarkerIndex(markers.indexOf(markers));
  }

  if (selectedInteriorCategory) {
    // If a category is selected, filter markers by category
    filteredMarkersForSearch = markers.filter((marker) => marker[4] === selectedInteriorCategory);
    setSelectedMarkerIndex(markers.indexOf(markers));
  }


  const foundMarker = filteredMarkersForSearch.find((marker) => {
    const markerNameLower = marker[0].toLowerCase();
    return markerNameLower.includes(searchLowerCase);
  });

  if (foundMarker) {
    setCenterPosition({
      lat: parseFloat(foundMarker[1]),
      lng: parseFloat(foundMarker[2]),
    });
    setSearchValue("");
    setSelectedMarkerIndex(markers.indexOf(foundMarker));
  }
};

//-----------------------------------Sort por location------------------------------------
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value || ""; 
    setSelectedCategory(newCategory);
  };
  const filteredMarkersCat = selectedCategory
    ? markers.filter((marker) => marker[6] === selectedCategory)
    : markers;


//-----------------------------------Sort por interior------------------------------------
  const [selectedInteriorCategory, setSelectedInteriorCategory] = useState("");
const handleInteriorCategoryChange = (event) => {
  const newInteriorCategory = event.target.value || "";
  setSelectedInteriorCategory(newInteriorCategory);
};

// const filteredInteriorMarkersCat = selectedInteriorCategory
//   ? markers.filter((marker) => marker[4] === selectedInteriorCategory)
//   : markers;

  //-----------------------------------V enter en search V-----------------------------------
     const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
    };

//-----------------------------------CHECKBOX------------------------------------
// Update handleCheckboxChange to toggle the flag
const handleCheckboxChange = (event) => {
  setShowInteriorMarkers(event.target.checked);
  const checkbox =event.target;
  const isChecked =checkbox.checked;

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

 
//--------------------------------MAP API-----------------------------------
  return (
  <APIProvider apiKey={"AIzaSyBOXmN9YX_vYDh6-MVPMFptNz2nLczHnmc"}>
{/*category drop down WIP*/}
<div className="map-container"> {/*Truco para que el boton quede frente al mapa*/}
{/*--------------------------------ACTUAL DROPDOWNBOXES------------------------------------*/}
   {showInteriorSelect ? (
        <div className="interior-select">
          <select id="interiorArea" onChange={handleInteriorCategoryChange} value={selectedInteriorCategory}>
            <option value="">All Interiors</option>
            {[...new Set(interiorMarkers.map((marker) => marker[3]))].map((interiorArea) => (
              <option key={interiorArea} value={interiorArea}>
                {interiorArea}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="category-select"> 
          <select id="categoria" onChange={handleCategoryChange} value={selectedCategory}>
            <option value="">All Locations</option>
            {[...new Set(markers.map((marker) => marker[6]))].map((categoria) => (
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
        <input id="status" type="checkbox" name="status" onChange={handleCheckboxChange} />
        <label htmlFor="status">
          <div className="status-switch" data-unchecked="Locations" data-checked="Interiors"></div>
        </label>
      </div>     

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
      
{/* --------------------------------ACTUAL MAP------------------------------------*/}
<div className="map-size">
        <Map zoom={17} center={centerPosition} mapId={"e22287fd572a8772"} tilt={0}>
          {getFilteredMarkers().map((currMarker, index) => (
            <React.Fragment key={index}>
              <AdvancedMarker
                position={{ lat: parseFloat(currMarker[1]), lng: parseFloat(currMarker[2]) }}
                onClick={() => handleMarkerClick(currMarker, index)}
              >
                <Pin
                  className="hide-outline"
                  background={index === selectedMarkerIndex ? "#3297FD" : "#FFD703"}
                  borderColor={"black"}
                  glyphColor={"#DAE0E6"}
                />
              </AdvancedMarker>
            </React.Fragment>
          ))}
        </Map>

  </div>
  </div>

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
              <p className="location-title">{selectedMarker[0]}</p>
            </div>
            <img
  className="location-img"
  src={selectedMarker[5] !== "" ? selectedMarker[5] : LocImgPH} alt={selectedMarker[5] !== "" ? selectedMarker[0] : "LocImgPH"} /> {/*Imagen*/}
            <hr className='hr-modal ' />
            <p className="location-info-text">{selectedMarker[3]}</p>{/*Nivel*/}
            <p className="location-info-text">{selectedMarker[4]}</p>{/*Descripcion*/}
            <div className="modal-exit">
              <Link className="modal-exit" onClick={closePopup}>Exit</Link>{/*Exit*/}
            </div>
          </div>
        )}
      </Modal>
    </APIProvider>
  );
}
