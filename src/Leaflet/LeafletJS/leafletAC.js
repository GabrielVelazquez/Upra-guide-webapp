import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
import imagenmapa from '../../images/AC_100_leaflet_PN.png';
//import waypoint from '../../images/Leaflet_marker_upra.png';
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";

const LearningCommons = () => {
  const bounds= [[-90, -90], [1800, 880]]; //= [[0, 0], [1592, 807]];

//Coordenadas de los extintores-----------------------------------------------------------------------------------------------------------
  const ExtintorLocations = [
   // [],

  ];

  const PullStationLocations = [
   // [],

  ];

  const MeetingPointLocations = [
    //[],
  ];

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'AC101',
      positions: [
        [48.197676, 119.750977], [48.197676, 190.063477],
        [9.387633, 190.151367], [9.387633, 119.750977],
      ],
      markerPosition: [30.546697, 154.940186],
    },





    {
      name: 'AC108',
      positions: [
        [84.304962, 400.144043], [84.304962, 470.478516],
        [77.461998, 470.478516], [77.461998, 400.144043],
      ],
      markerPosition: [81.573683, 434.970703],
    },
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'AC101':
        return [[48.265841, 124.233398],[55.906543, 124.233398],[55.906543, 98.789063],[17.028871, 98.789063],[17.028871, 5.097656],[71.330647, 5.097656]];




      case 'AC108':
        return [[76.923586, 407.283203], [74.148744,407.283203],[74.148744, 797.695313]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'AC101':
        return [[48.265841, 126.233398],[55.832537, 126.233398],[55.906543, 380.390625],[74.148744, 380.390625],[74.034196, 798.222656]];
      case 'AC108':
        return [[76.923586, 405.283203], [74.148744,405.283203],[74.148744, 380.390625],[55.906543, 380.390625],[55.906543, 98.789063],[17.028871, 98.789063],[17.028871, 5.097656],[71.330647, 5.097656]];

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
  
  //CLICK PARA COORDENADAS SOLO PARA DEVELOPING //IMAGE COORDINATES--------------------------------------------------------------------
  const [mapClicked, setMapClicked] = useState(false);//IMAGE COORDINATES
  const popup = L.popup();

  /* const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        popup
          .setLatLng(e.latlng)
          .setContent("Clicked at " + e.latlng.toString())
          .openOn(map);
          // solo para re render el mapa despues de click
        setMapClicked(!mapClicked);
      },
    });
    return null;
  };
  */

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
   //END CLICK PARA COORDENADAS SOLO PARA DEVELOPING-----------------------------------------------------------------------------------
return (
  
  <div>   
     <h1 className='title-lc'>Salones Nivel AC 100</h1>
    <MapContainer center={[18.089666, 406.40625]} zoom={1}>
        <ImageOverlay url={imagenmapa} bounds={bounds} />
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

export default LearningCommons;