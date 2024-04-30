import React, { useState,useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline,  Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint, customInflamable} from './LeafletIcons';  // Import the custom marker icon
//import L from 'leaflet';
// import imagenmapa from '../../images/Cafeteria_leaflet_PN.png';
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';
import inflamable from '../../images/inflamableIcon_leaflet.png';

const Cafeteria = () => {
  const bounds = [[-100,-100], [1800, 800]];
  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FCafeteria_leaflet_PN.png?alt=media&token=77746b12-6c84-442c-9575-33ff7c1fcc61'
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
    [75.672197, 256.640625],//Cerca oficina
    [-48.458352, 341.367188], //Dentro del comedor
    [72.395706, 649.335938] //Dentro del comedor

  ];

  const PullStationLocations = [
    [-4.915833, 217.968750], [75.845169, 290.039063] //Cerca almacen

  ];

  const MeetingPointLocations = [
    [-80.532071, 145.546875],[-80.297927, 736.875000]

  ];
  const InflamableLocations = [
    [79.560546, 501.328125]
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
          (Estacionamiento Administracion)
        </div>
       
      </div>
    );
  };

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'Salon Comedor',
      positions: [[73.083508, 339.345703],[73.083508,  719.472656],
      [48.718079, 719.472656],[48.718079,  657.421875],
      [-71.284683,  656.894531],[-71.284683, 339.521484],[73.118902, 339.521484]],
      markerPosition: [9.875877, 509.062500],
    },
    {
      name: 'Multimedios',
      positions: [[-54.673831, 188.964844],[-54.673831, 322.382813],[-80.872827, 322.382813],[-80.872827, 188.964844]],
      markerPosition: [-72.181804, 246.796875],
    },
    {
      name: 'Cocina',
      positions: [[-0.703107, 15.644531],[-0.703107, 139.746094],[78.801980, 139.746094],[78.801980, 109.335938],
      [67.067433, 108.335938],[67.067433, 20.566406],[-0.703107, 20.566406]],
      markerPosition: [36.597889, 71.718750],
    },
    {
      name: 'Almacen',
      positions: [[82.563390, 24.433594],[82.563390, 141.152344],[79.105086, 141.152344],[79.105086, 107.841797],
      [67.474922,107.841797],[67.474922, 24.433594]],
      markerPosition: [76.679785, 73.476563],
    },
    {
      name: 'Oficina',
      positions: [[82.471829, 143.613281],[82.471829, 216.914063],[76.760541, 216.914063],[76.760541, 143.613281]],
      markerPosition: [79.935918, 180.878906],
    },
    {
      name: 'Cuarto HVAC',
      positions: [[-25.324167, 14.589844],[-25.324167,112.500000],[-58.904646, 112.500000],[-58.904646, 14.589844]],
      markerPosition: [-45.706179, 60.292969],
    },
    {
      name: 'Baños',
      positions: [[-54.367759, 188.261719],[-54.367759, 290.566406],[-44.465151, 290.390625],[-44.465151, 188.261719]],
      markerPosition: [-50.847573, 242.226563],
    },
    {
      name: 'Linea de Servicio',
      positions: [[65.330178, 140.976563],[65.330178, 334.775391],[32.546813, 334.775391],[32.546813, 140.976563]],
      markerPosition: [51.835778, 233.789063],
    }
    
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'Salon Comedor':
        return [[-24.206890, 347.695313],[-24.206890, 160.3125],[-76.840816, 160.3125]];

      case 'Multimedios':
        return [[-54.162434, 298.476563],[-38.822591, 298.476563],[-38.822591, 161.015625],[-76.840816, 161.015625]];
      
      case 'Cocina':
        return [[35.746512, 134.648438],[35.746512, 151.523438],[-38.822591, 151.523438],[-76.840816, 151.523438]];
      
      case 'Linea de Servicio':
        return [[35.746512, 151.523438],[-38.822591, 151.523438],[-76.840816, 151.523438]];
      
      case 'Almacen':
        return [[75.230667, 107.578125],[75.230667, 371.953125]];
      
      case 'Oficina':
        return [[77.157163, 149.414063],[75.230667, 149.414063],[75.230667, 371.953125]];
      
      case 'Cuarto HVAC':
        return [[-33.431441, 112.851563],[-33.431441, 145.195313],[-76.840816, 145.195313]];
      
      case 'Baños':
        return [[-44.087585, 240.820313],[-33.431441, 240.820313],[-33.431441, 145.195313],[-76.840816, 145.195313]];
      

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'Salon Comedor':
        return [[-25.482951, 654.960938],[-25.482951, 736.171875],[-77.692870, 736.171875]];
      
      case 'Multimedios':
        return [[-54.162434, 298.476563],[-25.165173, 298.165173],[-25.165173, 736.171875],[-77.692870, 736.171875]];

      case 'Cocina':
        return [[37.160317, 137.8125],[37.160317, 416.25],[-22.593726, 416.25],[-22.593726, 736.171875],[-77.692870, 736.171875]];

      case 'Linea de Servicio':
        return [[37.160317, 333.984375],[37.160317, 416.25],[-22.593726, 416.25],[-22.593726, 736.171875],[-77.692870, 736.171875]];
      
      case 'Almacen':
        return [[75.320025, 108.281250],[75.320025,119.53125],[36.879621,119.53125],[36.879621,151.523438],[-38.822591, 151.523438],[-76.840816, 151.523438]];
      
      case 'Oficina':
        return [[76.434604, 148.535156],[75.140778, 148.535156],[75.140778, 124.628906],[36.315125, 124.628906],
        [36.315125, 151.523438],[-76.840816, 151.523438]];
      
      case 'Baños':
        return [[-43.580391, 241.523438],[-25.482951, 241.523438],[-25.482951,736.171875],[-77.692870, 736.171875]];
      
      case 'Cuarto HVAC':
        return [[-28.921631, 112.148438],[-28.921631, 342.070313],[-28.921631 ,736.171875],[-77.692870, 736.171875]];
        

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
    <MapContainer center={[43.580391, 345.937500]} zoom={1}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Cafeteria</h1>
        <Legend />
{/*Boton de centralizar===============================*/}
          <RecenterButton handleCenterMap={handleCenterMap} center={[43.580391, 345.937500]} zoom={1} />
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

export default Cafeteria;