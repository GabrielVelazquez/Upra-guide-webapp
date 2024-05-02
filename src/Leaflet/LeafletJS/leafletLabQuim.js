import React, {useState, useRef}  from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline,  Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint, customInflamable} from './LeafletIcons';  // Import the custom marker icon
//import L from 'leaflet';
// import imagenmapa from "../../images/LabsQuim_leaflet.png";
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui';
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';
import inflamable from '../../images/inflamableIcon_leaflet.png';

const LabQuim = () => {
    const bounds = [[-85, -85], [1400, 400]];
    const mapRef = useRef(null); // Reference to the map instance
    const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FLabsQuim_leaflet.png?alt=media&token=02079e10-ed12-4597-bca4-ae7d0ee06c45'
//BOTONES DE USO=============================================================================================================================
 //Function para centralizar=========================
 const handleCenterMap = (center, zoom) => {
  if (mapRef.current) {
    mapRef.current.setView(center, zoom);
  }
};

  //funcion de reset polylines=======================
   // Reset polyliness (rutas)
   const handleResetPolylines = () => {
    setPathLineCoords([]);
    setAltPathLineCoords([]);
  };
//BOTONES DE USO=============================================================================================================================

    //Coordenadas de los extintores-----------------------------------------------------------------------------------------------------------
  const ExtintorLocations = [
    [82.983639, 133.066406],[80.151825, 109.160156],[5.747270, 85.078125],[-52.581616, 88.593750],[-80.195099, 39.375000],
    [-80.014008, -5.976563]
   ];
 
   const PullStationLocations = [
    [-64.684935, 139.042969]
   ];
 
   const MeetingPointLocations = [
    [-85.597540, 70.312500],[48.067953, 274.218750]
   ];

   const InflamableLocations = [
    [81.625536, 8.437500],[22.069072, -68.554688]

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
          <img src={inflamable} alt="Combustible/Inflamable" />
          Combustible Inflamable
        </div>
        <div className="legend-item">
          <img src={meet} alt="Punto de reunión" />
          Puntos de reunión <br />
          (Estacionamiento Facultad 1 y 3)
        </div>
       
      </div>
    );
  };

    //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
        name: 'LAB AC141',
        positions: [ 
            [80.072759, -57.260742],[80.072759, 134.956055],[78.036023, 134.956055],[78.036023, 97.119141],
            [57.495655, 97.119141],[57.495655,-57.260742]
        ],
        markerPosition: [76.854159, 28.828125],
    },
    {
        name: 'LAB AC143',
        positions: [ 
            [55.201859, -57.260742],[55.201859, 97.03125],[11.934580, 97.03125],[11.934580,134.956055],
            [3.589088, 134.956055],[3.589088,-57.260742]
        ],
        markerPosition: [31.979296, 28.125],
    },
    {
      name: 'LAB AC145',
      positions: [ 
          [1.436454,-57.260742],[2.138641, 97.03125],[-44.663090, 97.03125],[-44.663090, 134.956055],
          [-55.404178, 134.956055],[-55.404178, -57.260742]
      ],
      markerPosition: [-35.385376, 19.6875],
  },
  {
    name: 'Oficina AC141/143',
    positions: [ 
        [77.589353, 99.580078],[77.589353, 134.956055],[12.993753, 134.956055],[12.993753, 99.580078]
    ],
    markerPosition: [55.381466, 118.125000],
  },
  {
    name: 'Oficina AC145',
    positions: [ 
        [1.412770, 98.789063],[1.412770, 134.648438],[-43.608709, 134.648438],[-43.608709, 98.789063]
    ],
    markerPosition: [-24.997805, 119.531250],
  },
  {
    name: 'Area Satelite Sustancias Quimicas',
    positions: [ 
        [83.458462, 2.197266],[83.458462, 81.386719],[80.179206, 81.386719],[80.179206, 2.197266]
    ],
    markerPosition: [82.032563, 38.056641],
  },
  {
    name: 'Almacen de Suministros',
    positions: [ 
        [-68.214275, 15.029297],[-68.214275, 105.117188],[-80.161701, 105.117188],[-83.253568, 68.378906],
        [-80.471861, 35.771484],[-80.369566, 15.029297]
    ],
    markerPosition: [-75.410722, 54.140625],
  }

   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'LAB AC141':
        return [[79.069538, 135.703125],[79.069538, 155.742188],[-80.517446, 155.742188],[-85.234258, 77.343750],
        ];

      case 'LAB AC143':
        return [[6.882832, 137.109375],[6.882832, 155.742188],[-80.517446, 155.742188],[-85.234258, 77.343750]];
      
      case 'LAB AC145':
        return [[-52.847062, 137.109375],[-52.847062, 155.742188],[-80.517446, 155.742188],[-85.234258, 77.343750]];
      
      case 'Oficina AC141/143':
        return [[42.689728, 136.054688],[42.689728, 155.742188],[-80.517446, 155.742188],[-85.234258, 77.343750]];

      case 'Oficina AC145':
        return [[-3.659006, 136.757813],[-3.659006, 155.742188],[-80.517446, 155.742188],[-85.234258, 77.343750]];

      case 'Area Satelite Sustancias Quimicas':
        return [[80.402999, 84.550781],[81.872835, 136.582031],[81.872835, 155.742188],[-80.517446, 155.742188],[-85.234258, 77.343750]];
      
      case 'Almacen de Suministros':
        return [[-82.560076, 51.679688],[-85.234258, 77.343750]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'LAB AC141':
        return [[68.034172, 95.625000],[68.034172, 117.949219],[43.936451, 117.949219],[43.936451, 177.714844],
        [41.792511, 273.515625]];

      case 'LAB AC143':
        return [[7.328376, 135.703125],[7.328376, 154.335938],[19.360884, 154.335938],[41.792511, 273.515625]];
      
      case 'LAB AC145':
        return [[-50.662363, 138.164063],[-50.662363, 154.335938],[19.360884, 154.335938],[41.792511, 273.515625]];
      
      case 'Oficina AC141/143':
        return [[68.034172, 117.949219],[43.936451, 117.949219],[43.936451, 177.714844],
        [41.792511, 273.515625]];

      case 'Oficina AC145':
        return [[-43.541763, 104.589844],[-48.651651, 104.589844],[-48.651651,154.335938],[19.360884, 154.335938],
        [41.792511, 273.515625]];

      case 'Area Satelite Sustancias Quimicas':
        return [[80.564411, 87.1875],[81.808299, 137.109375],[81.808299, 154.335938],[19.360884, 154.335938],
        [41.792511, 273.515625]];
      
      case 'Almacen de Suministros':
        return [[-82.234816, 43.593750],[-85.577716, 51.679688],[-76.801250, 154.335938],[19.360884, 154.335938],
        [41.792511, 273.515625]];

        
         
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
/*
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
*/
//END CLICK PARA COORDENADAS SOLO PARA DEVELOPING/////////////////////////////////////////////////////////////////////
return (
  
  <div className='leafletcss1'>   
       
    <MapContainer center={[31.353637, 119.531250]} zoom={1}ref={mapRef}>
        <ImageOverlay url={imagenmapa} bounds={bounds} />

        <h1 className='title-lc'>Laboratorios de Quimica</h1>
        <Legend />

{/*Boton de centralizar===============================*/}
<RecenterButton handleCenterMap={handleCenterMap} center={[31.353637, 119.531250]} zoom={1} />
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
{/*Hace render a los markers icons (Pull statuions)*/}
{InflamableLocations.map((position, index) => ( 
           <Marker key={index} position={position} icon={customInflamable}></Marker> 
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

export default LabQuim;