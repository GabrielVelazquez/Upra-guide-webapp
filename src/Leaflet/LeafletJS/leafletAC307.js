import React, { useState,useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline,  Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
//import L from 'leaflet';
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

const AC307 = () => {
  const bounds = [[-90, -90], [1310, 310]];
  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FAC307_310_leaflet.png?alt=media&token=534337f3-e47a-4286-b83e-163b1b65dadf'
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
    [-31.000657, 134.648438],[33.506294, -24.960937],[69.912530, 50.273438]

  ];

  const PullStationLocations = [
   [-75.655075, -28.828125]
   
  ];

  const MeetingPointLocations = [
    [-84.020193, -53.437500],[83.365467, 258.750000]
   
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
          (Estacionamiento Facultad 2 y 4)
        </div>
       
      </div>
    );
  };

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'AC307 A',
      positions: [[64.314775, -20.917969],[64.314775, 134.472656],[30.504696, 134.472656],[30.504696, -20.917969]],
      markerPosition: [50.091844, 53.613281],
    },
    {
      name: "AC307 B",
      positions: [[71.427898, 136.582031],[71.427898, 289.423828],[30.616147 ,289.423828],[30.616147, 136.582031]],
      markerPosition: [52.553781, 206.015625],
    },
    {
      name: "Laboratorio DECEP AC308",
      positions: [[27.233463, -20.917969],[27.233463, 127.265625],[-39.019501, 127.265625],[-39.019501, -20.917969]],
      markerPosition: [5.323952, 51.855469],
    },
    {
      name: "Laboratorio AC309 A",
      positions: [[28.056227, 130.429688],[28.056227, 288.984375],[-73.706375, 288.984375],[-73.706375,  253.652344],
      [-51.817566 ,253.652344],[-51.817566, 130.429688]],
      markerPosition: [-18.601343, 207.421875],
    },
    {
      name: "AC309 B",
      positions: [[-52.880942, 130.605469],[-52.880942, 252.246094],[-73.5071, 252.246094],[-73.5071, 130.605469]],
      markerPosition: [-64.974899, 190.722656],
    },
    {
      name: "Area de Reparaciones AC310",
      positions: [[-50.827562, 128.144531],[-73.407083, 128.144531],[-73.5071, -21.445312],[-50.827562, -21.445312]],
      markerPosition: [-64.376134, 52.207031],
    },
    {
      name: "Baño F",
      positions: [[83.537287, -20.390625],[83.537287, 135.527344],[79.171557 ,135.527344],[79.171557, 13.535156],
      [80.815804 ,13.535156],[80.815804,-20.390625]],
      markerPosition: [81.619712, 56.953125],
    },
    {
      name: "Baño M",
      positions: [[78.801362, 13.798828],[78.801362,135.527344],[71.780377, 135.527344],[71.780377, -20.830078],
      [77.177440, -20.830078],[77.177440,13.798828]],
      markerPosition: [75.158842, 52.734375],
    }

  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
    case 'AC307 A':
      return [[64.853657, -12.304688],[68.97496, -12.304688],[68.97496, -58.359375 ],[-84.651695, -58.359375]];

    case 'AC307 B':
      return [[68.97496, 138.339844],[68.97496, -58.359375 ],[-84.651695, -58.359375]];
    
    case 'Laboratorio DECEP AC308':
      return [[-40.795964, 52.558594],[-45.161867, 52.558594],[-45.161867, -58.359375],[-84.651695, -58.359375]];
    
    case 'Laboratorio AC309 A':
      return[[-45.161867,130.429688],[-45.161867, -58.359375],[-84.651695, -58.359375]];
    
    case 'AC309 B':
      return[[-50.771216, 141.855469],[-45.161867,141.855469],[-45.161867, -58.359375],[-84.651695, -58.359375]];

    case 'Area de Reparaciones AC310':
      return [[-71.040746, -23.730469],[-71.040746, -58.359375],[-84.651695, -58.359375]];
    
    case 'Baño M':
      return [[75.689190, -21.796875],[75.689190, -58.359375],[-84.651695, -58.359375]];
    
    case 'Baño F':
      return [[82.025488, -20.742188],[82.025488, -58.359375],[-84.651695, -58.359375]];
  

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'AC307 A':
        return [[64.513474, -4.218750],[68.814987, -4.218750],[68.814987, -60.46875],[84.304711, -60.46875],[84.304711, 159.609375]];
  
      case 'AC307 B':
        return [[68.97496, 138.339844],[68.97496, -60.46875 ],[84.304711, -60.46875],[84.304711, 159.609375]];
      
      case 'Laboratorio DECEP AC308':
        return [[20.775449, -22.148438],[20.775449, -52.382813],[84.304711,-52.382813],[84.304711, 159.609375]];
      
      case 'Laboratorio AC309 A':
        return[[-44.187717, 130.781250],[-44.187717, -52.382813],[84.304711,-52.382813],[84.304711, 159.609375]];
      
      case 'AC309 B':
        return[[-51.040828, 149.0625],[-42.138279, 149.0625],[-42.138279, -58.007813],[84.304711,-58.007813],[84.304711, 159.609375]];
  
      case 'Area de Reparaciones AC310':
        return [[-67.389562, -24.609375],[-67.389562, -52.382813],[84.304711,-52.382813],[84.304711, 159.609375]];
      
      case 'Baño M':
        return [[75.206603, -21.972656],[75.206603, -52.382813],[84.304711,-52.382813],[84.304711, 159.609375]];
      
      case 'Baño F':
        return [[82.268417, -21.972656],[82.268417, -52.382813],[84.304711,-52.382813],[84.304711, 159.609375]];

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
 {/*
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
*/}
//END CLICK PARA COORDENADAS SOLO PARA DEVELOPING/////////////////////////////////////////////////////////////////////

return (

  <div className='leafletcss1'>   
    <MapContainer center={[5.099331, 121.640625]} zoom={1}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Salones AC 307-310</h1>
        <Legend />
{/*Boton de centralizar===============================*/}
          <RecenterButton handleCenterMap={handleCenterMap} center={[5.099331, 121.640625]} zoom={1} />
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
{/*<MapClickHandler /> */}  {/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default AC307;