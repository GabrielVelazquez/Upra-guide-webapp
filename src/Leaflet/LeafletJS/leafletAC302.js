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

const AC302 = () => {
  const bounds = [[-90, -90], [1700, 700]];
  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FAC302_306_leaflet.png?alt=media&token=fe6ffd19-cf54-441c-acf8-bafc94f34aff'
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
    [13.396715, 265.781250],[-18.769262, 227.109375],[54.670577, -37.265625],[-59.409225, 520.488281]

  ];

  const PullStationLocations = [
   [-17.25694, 342.421875]
   
  ];

  const MeetingPointLocations = [
    [83.035777, -68.203125],[-74.693974, -66.093750],[-80.937346, 535.78125]
   
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
          (Estacionamiento Facultad 2)
        </div>
       
      </div>
    );
  };
 
   

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'AC302 RODEL',
      positions: [[79.466780, 261.210938],[79.466780, 359.121094],[-10.852076, 359.121094],[-10.852076, 261.210938]],
      markerPosition: [51.377929, 307.968750],
    },
    {
      name: "AC303",
      positions: [[79.466780, 161.455078],[79.466780, 258.398438],[-11.446761, 258.398438],[-11.446761, 223.505859],
        [20.679892, 223.505859],[20.679892, 161.455078]],
      markerPosition: [58.132954, 211.289063],
    },
    {
      name: "Histriones AC303 B",
      positions: [[19.832292, 91.054688],[19.832292, 221.220703],[-11.461087 ,221.220703],[-11.461087, 91.054688]],
      markerPosition: [4.298816, 150.117188],
    },
    {
      name: "AC304",
      positions: [[79.466780, 57.392578],[79.591480, 158.818359],[21.966873, 158.818359],[21.966873,  89.208984],
        [-11.211457, 89.208984],[-11.211457, 57.392578]],
      markerPosition: [59.052012, 106.875],
    },
    {
      name: "Laboratorio de Redación AC305",
      positions: [[48.234536, -40.253906],[48.234536, 54.492188],[-12.137217,54.492188],[-12.137217, -40.253906]],
      markerPosition: [23.444069, 4.570313],
    },
    {
      name: "AC306",
      positions: [[79.300276, -40.957031],[79.300276, 54.492188],[50.769243 ,54.492188],[50.769243, -40.957031]],
      markerPosition: [68.981441, 5.800781],
    },
    {
        name: "Departamento ESPA/MATE",
        positions:[[-42.455864, 440.947266],[-67.711359, 502.031250],[-29.452800, 579.990234],[7.337281, 529.277344]],
        markerPosition: [-34.168189, 515.039063],
    }

  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
    case 'AC302 RODEL':
      return [[-14.228073, 267.890625],[-30.403603, 267.890625],[-30.403603, -66.269531],[78.502836, -66.269531]];

    case 'AC303':
      return [[-16.208072, 245.390625],[-30.403603, 245.390625],[-30.403603, -66.269531],[78.502836, -66.269531]];
    
    case 'Histriones AC303 B':
      return [[-14.392230, 195.996094],[-30.403603, 195.996094],[-30.403603, -66.269531],[78.502836, -66.269531]];
    
    case 'AC304':
      return[[-13.879421, 63.984375],[-30.403603, 63.984375],[-30.403603, -66.269531],[78.502836, -66.269531]];
    
    case 'Laboratorio de Redación AC305':
      return[[-13.734961, 45.000000],[-30.403603, 45.000000],[-30.403603, -66.269531],[78.502836, -66.269531]];

    case 'AC306':
      return [[57.531088, -43.242188],[57.531088, -66.269531],[78.502836, -66.269531]];
    
    case 'Departamento ESPA/MATE':
      return [[-65.894395, 495.351563],[-69.183752, 482.958984],[-30.403603, 355.781250],[-30.403603, -66.269531],
             [78.502836, -66.269531]];
   

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      
     case 'AC302 RODEL':
        return [[-12.860969, 272.109375],[-28.726505, 272.109375],[-28.726505, -63.457031],[-74.138979, -63.457031]];
      
     case 'AC303':
        return [[-13.203188, 242.578125],[-28.726505, 242.578125],[-28.726505, -63.457031],[-74.138979, -63.457031]];
          
     case 'Histriones AC303 B':
        return [[-13.374118, 193.359375],[-28.726505, 193.359375],[-28.726505, -63.457031],[-74.138979, -63.457031]];
          
     case 'AC304':
        return[[-13.544928, 68.730469],[-28.726505, 68.730469],[-28.726505, -63.457031],[-74.138979, -63.457031]];
          
     case 'Laboratorio de Redación AC305':
        return[[-15.734961, 46.000000],[-28.726505, 47.285156],[-28.726505, -63.457031],[-74.138979, -63.457031]];
      
     case 'AC306':
        return [[50.829713, 47.285156],[-28.726505, 47.285156],[-28.726505, -63.457031],[-74.138979, -63.457031]];
          
     case 'Departamento ESPA/MATE':
        return [[-67.383469, 498.164063],[-72.689403, 481.113281],[-50.155272, 371.953125],[-80.070648, 371.953125],
            [-80.070648, 477.246094],[-80.070648, 518.203125]];

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
    <MapContainer center={[9.261135, 296.015625]} zoom={1}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
    
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Salones AC 302-306 y Departamento de ESPA/MATE</h1>
        <Legend />
{/*Boton de centralizar===============================*/}
          <RecenterButton handleCenterMap={handleCenterMap} center={[9.261135, 296.015625]} zoom={1} />
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

export default AC302;