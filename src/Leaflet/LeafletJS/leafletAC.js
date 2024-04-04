import React, { useState, useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
// import imagenmapa from '../../images/AC_100_leaflet_PN.png';
//import waypoint from '../../images/Leaflet_marker_upra.png';
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
const AC2 = () => {
  const bounds = [[-90, -90], [1800, 880]];
  const mapRef = useRef(null); // Reference to the map instance
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FAC_100_leaflet_PN.png?alt=media&token=5e28c4ee-8845-4d7b-bbe0-87353c147094'

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
    [-82.634101, -24.082031],
    [-53.652143, 189.667969],
    [-8.769486, 760.078125],
    [55.175571, 691.699219]

  ];

  const PullStationLocations = [
   [55.176033, 663.398438],

  ];

  const MeetingPointLocations = [
    [83.440046, 826.875000],
    [83.440046, -43.593750]
  ];

  const Legend = () => {
    return (
      <div className="legend">
        <h3>Leyenda</h3>
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
          (Estacionamiento facultad 1)
        </div>
        <div className="legend-item">
          <Polyline positions={pathLineCoords} color="red" /> {/*rutas de salida*/}
          Ruta de salida
        </div>
      </div>
    );
  };
  

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'AC101',
      positions: [
        [-57.105338,  54.163284], [-57.105338, 138.407135],
        [-83.121618,138.407135], [-83.121618, 54.163284],
    ],
    markerPosition: [-74.628825, 95.625],
    },

    {
      name: 'AC102',
      positions: [
        [57.111246, 54.132385], [57.111246, 138.401467],
        [-20.787427, 138.401467], [-20.787427,54.132385],
      ],
      markerPosition: [23.191931, 96.328125],
    },
    
    {
      name: 'AC103',
      positions: [
        [-57.105338, 146.293945], [-57.105338, 230.581055],
        [-83.121618, 230.581055], [-83.121618,146.293945],
      ],
      markerPosition: [-74.040291, 188.437500],
    },
    
    {
      name: 'AC104',
      positions: [
        [57.111246, 146.286650], [57.111246,  230.855713],
        [-20.787427,  230.855713], [-20.787427, 146.601563],
      ],
      markerPosition: [24.478411, 187.734375],
    },
    
    {
      name: 'AC105',
      positions: [
        [-57.104934, 238.463745], [-57.104934, 322.693176],
        [-83.121618, 322.693176], [-83.121618, 238.463745],
      ],
      markerPosition: [-74.610222, 279.843750],
    },
    
    {
      name: 'AC106',
      positions: [
        [57.111246,  238.754883], [57.111246, 322.66571],
        [-20.787427,322.66571], [-20.787427,  238.754883],
      ],
      markerPosition: [21.892956, 279.843750],
    },
    
    {
      name: 'AC107',
      positions: [
        [22.934301, 391.035004], [22.934301, 475.272675],
        [-55.840690, 475.272675], [-55.840690, 391.035004],
      ],
      markerPosition: [-20.030479, 433.125000],
    },
    
    {
      name: 'AC108',
      positions: [
        [83.477852, 391.036377], [83.477852, 475.268555],
        [58.722222, 475.268555], [58.722222, 391.036377],
      ],
      markerPosition: [76.006790, 433.125000],
    },
    
    {
      name: 'AC109',
      positions: [
        [22.934301, 483.168240], [22.934301,  567.417068],
        [-55.840690,  567.417068], [-55.840690, 483.168240],
      ],
      markerPosition: [-20.689775, 523.828125],
    },
    
    {
      name: 'AC110',
      positions: [
        [83.477852, 483.167725], [83.477852, 567.425308],
        [58.722222, 567.425308], [58.722222, 483.167725],
      ],
      markerPosition: [76.006790, 524.531250],
    },
    
    {
      name: 'AC111',
      positions: [
        [22.934301, 575.639648], [22.934301, 659.575195],
        [-55.840690, 659.575195], [-55.840690, 575.639648],
      ],
      markerPosition: [-21.999737, 617.343750],
    },
    
    {
      name: 'AC112',
      positions: [
        [83.477852,  575.306282], [83.477852, 659.582062],
        [58.722222, 659.582062], [58.722222,  575.306282],
      ],
      markerPosition: [75.310156, 616.640625],
    },
    
    {
      name: 'AC113',
      positions: [
        [22.934301, 667.458572], [22.934301, 750.719662],
        [-55.840690, 750.719662], [-55.840690, 667.458572],
      ],
      markerPosition: [-20.689775, 707.34375],
    },
    
    {
      name: 'AC114',
      positions: [
        [83.477852, 667.463379], [83.477852, 750.729618],
        [58.722222, 750.729618], [58.722222, 667.463379],
      ],
      markerPosition: [75.487432, 709.453125],
    },
    
    {
      name: 'AC115',
      positions: [
        [22.934301, 758.605657], [22.934301, 841.875372],
        [-55.840690, 841.875372], [-55.840690, 758.605657],
      ],
      markerPosition: [-21.346219, 800.859375],
    },

    
    
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'AC101':
        return [[-53.958744, 60.820313],[-40.450481, 60.820313],[-40.450481, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];

      case 'AC102':
        return [[-25.883712, 60.820313],[-40.450481, 60.820313],[-40.450481, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];

      case 'AC103':
        return [[-53.969814, 224.011230],[-40.450481, 224.011230], [-40.450481, 60.820313],[-40.450481, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
      
      case 'AC104':
        return [[-25.959474, 224.011230],[-40.450481, 224.011230], [-40.450481, 60.820313],[-40.450481, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];

      case 'AC105':
        return [[-53.969814, 245.214844],[-40.450481, 245.214844], [-40.450481, 60.820313],[-40.450481, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
      
      case 'AC106':
        return [[-26.438770, 245.214844],[-40.450481, 245.214844], [-40.450481, 60.820313],[-40.450481, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
      
      case 'AC107':
        return [[27.680614, 400.221680],[44.702472, 400.221680],[44.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC108':
        return [[55.799463, 400.221680],[44.702472, 400.221680],[44.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC110':
        return [[55.075222, 560.214844], [44.207853, 560.214844],[44.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC109':
        return [[27.986964, 560.214844], [44.207853, 560.214844],[44.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC111':
        return [[27.987851, 582.539063], [43.831911, 582.539063],[44.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC112':
          return [[55.571092, 582.539063], [43.831911, 582.539063],[44.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC113':
          return [[27.913945, 743.378906], [44.440367, 743.378906],[44.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC114':
        return [[55.812871, 743.378906], [44.440367, 743.378906],[44.440367, 829.335938],  [56.256063, 829.335938]];

        case 'AC115':
          return [[27.913945, 767.636719], [44.440367, 767.636719],[44.440367, 829.335938],  [56.256063, 829.335938]];
          
          
        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'AC101':
        return [[-53.958744, 63.820313],[-40.450481, 63.820313],[-40.450481, 358.59375],[40.440367, 358.59375],[40.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC102':
        return [[-25.883712, 63.820313],[-40.450481, 63.820313],[-40.450481, 358.59375],[40.440367, 358.59375],[40.440367, 829.335938],  [56.256063, 829.335938]];
      
      case 'AC103':
        return [[-53.958744, 227.011230],[-40.450481, 226.867676],[-40.450481, 358.59375],[40.440367, 358.59375],[40.440367, 829.335938],  [56.256063, 829.335938]];
      
      case 'AC104':
        return [[-26.11973, 227.011230],[-40.450481, 226.867676],[-40.450481, 358.59375],[40.440367, 358.59375],[40.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC105':
        return [[-53.958744, 249.082031],[-40.450481, 249.082031],[-40.450481, 358.59375],[40.440367, 358.59375],[40.440367, 829.335938],  [56.256063, 829.335938]];

      case 'AC106':
        return [[-26.197504, 249.082031],[-40.450481, 249.082031],[-40.450481, 358.59375],[40.440367, 358.59375],[40.440367, 829.335938],  [56.256063, 829.335938]];
        
      case 'AC107':
        return [[27.565257, 397.221680],[44.702472, 397.221680],[44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];

      case 'AC108':
        return [[55.799463, 397.221680],[44.702472, 397.221680],[44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];

      case 'AC109':
        return [[27.565257, 557.578125],[44.702472, 557.226563],[44.702472, 397.221680], [44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];

      case 'AC110':
        return [[55.177753, 557.578125],[44.702472, 557.226563],[44.702472, 397.221680], [44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
         
      case 'AC111':
        return [[27.759362, 579.946289],[44.702472, 579.946289],[44.702472, 397.221680], [44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
      
      case 'AC112':
        return [[55.177753, 579.946289],[44.702472, 579.946289],[44.702472, 397.221680], [44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
     
      case 'AC114':
        return [[55.177753,  739.863281],[44.702472, 739.863281],[44.702472, 397.221680], [44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
      
      case 'AC113':
        return [[27.360721,  739.863281],[44.702472, 739.863281],[44.702472, 397.221680], [44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
     
      case 'AC115':
        return [[27.360721,  763.505859],[44.651298, 763.505859],[44.702472, 397.221680], [44.702472,  354.375],[-38.011765, 354.375],[-38.011765, 26.367188],[-81.04527, 26.367188],[-81.04527, -84.726563]];
         
        default:
        return [];
    }
  };

  //CONSTANTE DE MARKERS Y RUTAS DE SALIDAS (definir)----------------------------------------------------------------------------------------------
  const [markerPosition, setMarkerPosition] = useState(null); //marker invisible por default
  const [pathLineCoords, setPathLineCoords] = useState([]); //path polyline ruta de salida
  const [AltpathLineCoords, setAltPathLineCoords] = useState([]); //path polyline ruta de salida

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
  //const [mapClicked, setMapClicked] = useState(false);//IMAGE COORDINATES
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
        
    <MapContainer center={[15.166345, 389.53125]} zoom={1}  ref={mapRef}>
    <Legend />
        <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Salones Nivel AC 100</h1>
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
<MapClickHandler />  {/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default AC2;