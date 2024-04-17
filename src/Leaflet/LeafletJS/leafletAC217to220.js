import React, { useState,useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
// import imagenmapa from '../../images/AC_217-220_leaflet_PN.png';
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';

const AC217220 = () => {
  const bounds = [[-90, -90], [1800, 880]];
  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FAC_217-220_leaflet_PN.png?alt=media&token=2458e5db-d35c-4750-9979-44ce5c6a6584'
//BOTONES DE USO==================================================================================================================================
//Function para centralizar=========================
 const handleCenterMap = (center, zoom) => {
  if (mapRef.current) {
    mapRef.current.setView(center, zoom);
  }
};

//declaracion de reset polylines=======================
   // Reset polyliness (rutas)
   const handleResetPolylines = () => {
    setPathLineCoords([]);
    setAltPathLineCoords([]);
  };
//BOTONES DE USO==================================================================================================================================

//Coordenadas de los extintores-------------------------------------------------------------------------------------------------------------------
  const ExtintorLocations = [
    [49.636225, 426.445313]

  ];

  const PullStationLocations = [
    [50.089089, 507.656250]
   
  ];

  const MeetingPointLocations = [
    [31.481517, -77.343750],[83.973541, 614.531250]
   
  ];

  const Legend = () => {
    return (
      <div className="legend">
        <h3>Leyenda</h3>

        <div className="legend-item">
          <img src={exit} alt="Salida" /> {/*Salida*/}
          Salida
        </div>

        <div className="legend-item">
          <img src={altexit} alt="Salida alterna" /> {/*Salida alterna*/}
          Salida alterna
        </div>

        <div className="legend-item">
          <img src={extintor} alt="Extintor" />
          Extintores
        </div>
        <div className="legend-item">
          <img src={pull} alt="Estación de tirar" />
          Estaciones de emergencia
        </div>
        <div className="legend-item">
          <img src={meet} alt="Punto de reunión" />
          Puntos de reunión <br />
          (Estacionamiento Facultad 1 y 2)
        </div>
       
      </div>
    );
  };

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'AC217',
      positions: [[81.860715, 212.519531],[81.860715, 548.349609],[53.618373, 548.349609],[53.618373, 212.519531]],
      markerPosition: [72.211050, 381.796875],
    },
    {
      name: 'AC218',
      positions: [[-55.725990, -20.742188],[-55.725990, 204.873047],[21.181849, 204.873047],[21.181849, -20.742188]],
      markerPosition: [-25.959758, 94.218750],
    },
    {
      name: 'AC219',
      positions: [[81.649056, -20.742188],[81.649056, 204.873047],[54.00711, 204.873047],[54.00711, -20.742188]],
      markerPosition: [72.211141, 87.539063],
    },
    {
      name: 'AC220',
      positions: [[19.138855, 213.398438],[19.138855, 548.349609],[-55.632975, 548.349609],[-55.632975, 213.398438]],
      markerPosition: [-28.125887, 380.390625],
    },

  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'AC220':
        return [[24.861412, 258.574219],[36.248453, 258.574219],[36.248453, -52.734375]];

      case 'AC219':
        return [[51.08353, 193.886719],[36.248453, 193.886719],[36.248453, -52.734375]];

      case 'AC218':
        return [[25.503935, 192.832031],[36.248453, 192.832031],[36.248453, -52.734375]];

      case 'AC217':
        return [[51.531776, 258.574219],[36.248453, 258.574219],[36.248453, -52.734375]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'AC220':
        return [[25.210195, 533.671875],[39.259889, 533.671875],[39.259889, 581.660156],[83.571865, 581.660156],
        [83.571865, 613.125000]];

      case 'AC219':
        return [[50.687693, 197.753906],[39.259889,197.753906],[39.259889, 533.671875],[39.259889, 581.660156],[83.571865, 581.660156],
        [83.571865, 613.125000]];

      case 'AC218':
        return [[24.562828, 196.347656],[39.259889,196.347656],[39.259889, 533.671875],[39.259889, 581.660156],[83.571865, 581.660156],
        [83.571865, 613.125000]];

      case 'AC217':
        return [[51.688622, 533.671875],[39.259889, 533.671875],[39.259889, 581.660156],[83.571865, 581.660156],
        [83.571865, 613.125000]];

        default:
        return [];
    }
  };

  //CONSTANTE DE MARKERS Y RUTAS DE SALIDAS (definir)----------------------------------------------------------------------------------------------
  const [markerPosition, setMarkerPosition] = useState(null); //marker invisible por default
  const [pathLineCoords, setPathLineCoords] = useState([]); //path polyline ruta de salida (hidden)
  const [AltpathLineCoords, setAltPathLineCoords] = useState([]); //path polyline ruta de salida (hidden)

  //MOSTRAR RUTA CUANDO SE SELECCIONA-----------------------------------------------------------------------------------------------------
  const handlePolygonClick = (index) => {
    const polygon = polygons[index];
  
if (polygon) {
        console.log("Polygon name:", polygon.name); //para debugging

      const polylinePositions = getPolylinePositions(polygon.name);//principal
        console.log("Polyline positions:", polylinePositions); //para debugging
      const AltpolylinePositions = getAltPolylinePositions(polygon.name);//alterna
        console.log("Polyline positions:", AltpolylinePositions); //para debugging

       setPathLineCoords(polylinePositions); //mustra ruta de salida
       setAltPathLineCoords(AltpolylinePositions); //mustra ruta de salida alterna
       setMarkerPosition(polygon.markerPosition);  //muestra marker
    } else {
      console.log("Polygon is undefined at index:", index); //para debugging
   }
  };
 
//MUESTRA POLIGONO OVERLAY PARA LOCATION----------------------------------------------------------------------------------------------------
  const renderPolygons = () => {
    return polygons.map((polygon, index) => (
      <Polygon key={index} positions={polygon.positions} color="yellow" eventHandlers={{ click: () => handlePolygonClick(index) }}> {/*Yellow o #FFD703 (upraYellow)*/}
        {markerPosition && <Marker position={markerPosition} icon={customMarker}></Marker>}
        <Tooltip direction="bottom" offset={[0, 1]} opacity={1} permanent iconSize="fixed">
          <div>
            <span> ● {polygon.name}</span> 
          </div>
        </Tooltip>
      </Polygon>
    ));
  };
  
//END CLICK PARA COORDENADAS SOLO PARA DEVELOPING/////////////////////////////////////////////////////////////////////
  //const [mapClicked, setMapClicked] = useState(false);   //IMAGE COORDINATES   //const [mapClicked, setMapClicked]
  const popup = L.popup();
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        popup
          .setLatLng(e.latlng)
          .setContent("Clicked at " + e.latlng.toString())
          .openOn(map);
        // solo para re render el mapa despues de click
        //setMapClicked(!mapClicked);//reset de coordenadas ESTE FUE MI ERROR
        
        // Add event listener to copy coordinates when popup is opened
        const popupContent = document.querySelector('.leaflet-popup-content');
        if (popupContent) {
          const button = document.createElement('button');
          button.textContent = 'Copy Coords';
          button.addEventListener('click', () => {
            copyCoordinates(e.latlng);
          });
          popupContent.appendChild(button);
        }
      },
    });
  //copia las coordenadas
    const copyCoordinates = (latlng) => {
      const shorterLat = latlng.lat.toFixed(6);
      const shorterLng = latlng.lng.toFixed(6);
      const coordinates = shorterLat + ", " + shorterLng;
      navigator.clipboard.writeText(coordinates)
      //debugging
        .then(() => console.log("Coordenadas copiadas: " + coordinates))
        .catch((error) => console.error("Failed to copy coordinates: ", error));
    };
  
    return null;
  };
//END CLICK PARA COORDENADAS SOLO PARA DEVELOPING/////////////////////////////////////////////////////////////////////

return (

  <div className='leafletcss1'>   
    <MapContainer center={[15.166345, 389.53125]} zoom={1}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>AC AC217-220</h1>
        <Legend />
{/*Boton de centralizar===============================*/}
          <RecenterButton handleCenterMap={handleCenterMap} center={[15.166345, 395.53125]} zoom={1} />
{/*Boton de reset===============================*/}
          <ResetButton handleResetPolylines={handleResetPolylines} />
         {renderPolygons()} {/*muestra funciones de render a poligonos (salones)*/}
          <Polyline positions={pathLineCoords} color="red" /> {/*rutas de salida*/}
          <Polyline positions={AltpathLineCoords} color="red" dashArray="10, 10"/>{/*dashArray style para lineas entre cortadas (alt)*/}


{/*Hace render a los markers icons (ExtintorLocations)*/}
          {ExtintorLocations.map((position, index) => ( 
           <Marker key={index} position={position} icon={customExtintor}></Marker> 
          )
         )
        }
{/*Hace render a los markers icons (Pull statuions)*/}
           {PullStationLocations.map((position, index) => ( 
           <Marker key={index} position={position} icon={customPullStation}></Marker> 
           )
          )  
        }

{/*Hace render a los markers icons (Pull statuions)*/}
{MeetingPointLocations.map((position, index) => ( 
           <Marker key={index} position={position} icon={customMeetingPoint}></Marker> 
           )
          )  
        }

{/*DEV ONLY IMAGE COORDINATES*/}
<MapClickHandler />{/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default AC217220;