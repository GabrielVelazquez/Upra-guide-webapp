

// import imagenmapa from '../../images/DecanatoEstudiantes_leaflet_PN.png';



import React, { useState,useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';

import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component

const Decanato = () => {
 
  const bounds = [[-110, -110], [100, 680]];

  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FDecanatoEstudiantes_leaflet_PN.png?alt=media&token=33b68d89-d7ca-4d8f-a1a6-e2239822deb0';
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


//Coordenadas de los extintores-----------------------------------------------------------------------------------------------------------
  const ExtintorLocations = [
    [-31.181002, -2.109375], //ADEM
    [55.400136, 76.816406], //Entre COMU y Decanato
    [72.027132, 28.652344], //Afuera de COMU
    

  ];

  const PullStationLocations = [
   [78.915778, -34.453125], //Afuera de COMU

  ];

  const MeetingPointLocations = [
    [82.126582, -27.421875],//Afuera de COMU/Decanato
    [35.765738, -96.328125],//Afuera de ADEM
    
  ];

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'ADEM',
      positions: [
        [-35.090009, -84.726563], [-35.090009, 160.664063], [-84.066817, 160.664063], [-84.066817,-84.726563],
    ],
    markerPosition: [-67.552410, 19.335938],
    },
    {
      name: 'COMU',
      positions: [
        [70.973218, -84.726563], [70.973218,66.796875], [-34.176168, 66.796875], [-34.176168,-84.726563],
    ],
    markerPosition: [31.438825, -9.843750],
    },
  
    
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'ADEM':
        return [[-62.155262, -10.546875],[-62.155262,-100.898438],[30.173549, -100.898438]];
      
      case 'COMU':
        return [[34.425458, -9.843750],[80.307206, -9.843750]]

      
          
          
        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'ADEM':
        return [[-71.700088, -2.812500],[-71.700088, -16.523438],[77.623106,-16.523438]];
      
      case 'COMU':
        return [[34.425458, -9.843750],[-61.491836, -9.843750],[-61.491836, -96.679687],[30.173549, -96.679687]]
     
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
    <MapContainer center={[10.949322, 280.796875]} zoom={1}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
      <h1 className='title-lc'>Decanato de estudiantes</h1>
{/*Boton de centralizar===============================*/}
          <RecenterButton handleCenterMap={handleCenterMap} center={[10.949322, 280.796875]} zoom={1} />
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

export default Decanato;