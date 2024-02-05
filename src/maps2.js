import React, { useState, useRef, useEffect } from "react";
import Modal from 'react-modal';
import { APIProvider, Map, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { Link } from 'react-router-dom';
import './maps2.css';
import { firestore } from './firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import LocImgPH from "./images/location_PlaceHolder_img.png";


Modal.setAppElement('#root'); //  root para accesar el modal

    const fetchData = async () => {
      try {
        const locationCollection = collection(firestore, 'location');
        const snapshot = await getDocs(locationCollection);

        const markersArray = snapshot.docs.map((doc) => {
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

        //setMarkers(markersArray);
        return markersArray;
        //console.log('fetched markers');
      } catch (error) {
        console.error('Error fetching markers: ', error); //si falla muestra error en consola
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
      const [dataFetched, setDataFetched] = useState(false);
      
      useEffect(() => {
        if (!dataFetched) {
          fetchData().then((markersArray)=> {
            setMarkers(markersArray);
            setDataFetched(true);
            console.log('fetched markers');
          });
        }

    //fetchData();
  }, [dataFetched]); /*[firestore]*/

  

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

//Sort por category
  const [selectedCategory, setSelectedCategory] = useState("");
  const handleCategoryChange = (event) => {
    const newCategory = event.target.value || ""; 
    setSelectedCategory(newCategory);

  };
  

  const filteredMarkers = selectedCategory
    ? markers.filter((marker) => marker[6] === selectedCategory)
    : markers;


     const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
      }
      
      
    };

  return (
    <APIProvider apiKey={"AIzaSyBOXmN9YX_vYDh6-MVPMFptNz2nLczHnmc"}>

{/*category drop down WIP*/}
<div className="map-container"> {/*Truco para que el boton quede frente al mapa*/}
<div className="category-select">
          {/*<label htmlFor="category">Select Category:</label>*/}
          <select id="categoria" onChange={handleCategoryChange} value={selectedCategory}> {/*una categoria*/}
            <option value="">All Categories</option>
            {[...new Set(markers.map((marker) => marker[6]))].map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
{/*category drop down WIP*/}

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
      
                  {/*original drop down arriba del mapa*/}

        <div className="map-size">
        <Map zoom={17} center={centerPosition} mapId={"e22287fd572a8772"} tilt={0}>
          {filteredMarkers.map((currMarker, index) => (
            <React.Fragment key={index}>
              <AdvancedMarker
                position={{ lat: parseFloat(currMarker[1]), lng: parseFloat(currMarker[2]) }}
                onClick={() => handleMarkerClick(currMarker, index)}
              >
                <Pin  className="hide-outline"
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

  /* const markers = [
    ["Learning Common", 18.46985831778697, -66.74048648451151, "level 1", "este es LC", "https://tintadigital.upra.edu/wp-content/uploads/2018/10/jhgvgh-1.jpg"],
    ["Centro de estudiantes", 18.469747959138807, -66.7411613958695, "level 1", "Area publica para estudiantes. Amplia para actividades y conferencias. Edificio norte de la universidad, lado derecho del primer piso del lobby."],
    ["Cdata", 18.46896789694791, -66.74205185923252, "level 2", "este de cdata xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxfxxxxxxxxxxxxxxxxxxxxxWxxWSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxeeeeeeeeeeeeeeeee UWUWUWUWUWUWUWUWUW OWOWOWOWOWOWOWOW", "https://2.bp.blogspot.com/-hK7y-wGoIuk/Uzc_0yj4eFI/AAAAAAAAIdY/6P_axnWY10s/s3200/ShowcaseUPRA.jpg"],
    ["Biblioteca", 18.47014497045244, -66.74073189884444, "level 1", "este es la", "https://scontent.fsju2-1.fna.fbcdn.net/v/t1.18169-9/1234128_1766246350270982_7157008094877001913_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=dd63ad&_nc_ohc=f9FzPrAO8NwAX_fsc4E&_nc_oc=AQmU4pszJAsjQK_OsXu7Fj9qciKx21bxT4Msur-CfQoLYU4htnojZgUk2awvJAJqJoqwYSvWSYZdYV7JZW9L7FJG&_nc_ht=scontent.fsju2-1.fna&oh=00_AfA_NhrkYzzEyll7EcTPgB9JekNzyW5JRmUCHZbwp9JE7w&oe=658BAC55"],
  ];
  */