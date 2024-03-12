import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
import imagenmapa from '../../images/Learning_common_leaflet_PN.png';
//import waypoint from '../../images/Leaflet_marker_upra.png';
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";

const LearningCommons = () => {
  const bounds = [[0, 0], [1592, 807]];

//Coordenadas de los extintores-----------------------------------------------------------------------------------------------------------
  const ExtintorLocations = [
    [82.4663, 331.743164],
    [70.050585, 678.55957],
    [54.778787, 569.003906],
    [71.415685, 281.25],
    [58.310157, 70.751953],
  ];

  const PullStationLocations = [
    [82.4663, 314.868164],
    [70.050585, 688.337402],
    [58.298415, 61.171875],
  ];

  const MeetingPointLocations = [
    [64.248751, 17.050781],
    [82.586792, 728.4375],
  ];

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'Conference Room',
      positions: [
        [77.920958, 163.035113], [77.716721, 268.45804],
        [40.497613, 268.062391], [40.622979, 163.035113],
      ],
      markerPosition: [65, 215],
    },
    {
      name: 'Study Room 1',
      positions: [
        [61.336472, 271.647949], [61.336413, 372.513428],
        [43.397134, 372.875977], [43.397134, 271.647949],
      ],
      markerPosition: [52, 322],
    },
    {
      name: 'Study Room 2',
      positions: [
        [61.334376, 377.182617], [61.334376, 424.995117],
        [44.044642, 424.995117], [44.044642, 377.314453],
      ],
      markerPosition: [52, 401],
    },
    {
      name: 'Study Room 3',
      positions: [
        [61.334376, 429.521484], [61.334376, 478.037109],
        [43.71611, 478.037109], [43.71611, 429.785156],
      ],
      markerPosition: [52, 453.5],
    },
    {
      name: 'Male Bathroom',
      positions: [
        [64.436279, 481.992188], [64.436279, 530.683594],
        [47.641959, 530.15625], [47.641959, 508.007813],
        [40.722236, 508.007813], [40.722236, 481.992188],
      ],
      markerPosition: [55, 504.5],
    },
    {
      name: 'Female Bathroom',
      positions: [
        [77.627119, 482.080078], [77.570504, 506.381836],
        [75.36494, 506.689453], [75.298592, 530.332031],
        [65.33393, 530.419922], [65.33393, 481.992188],
      ],
      markerPosition: [71,504.5],
    },
    {
      name: 'Multimedia Room',
      positions: [
        [72.449505, 415.986328], [72.449505, 478.125],
        [62.231095, 478.125], [62.231095, 415.986328],
      ],
      markerPosition: [67.908743, 447.044678],
    },
    {
      name: 'Mechanical Room',
      positions: [
        [72.475659, 271.625977], [72.475659, 412.168806],
        [62.3301, 412.16880], [62.3301, 271.669922],
      ],
      markerPosition: [67.950291, 341.872559],
    },
    {
      name: 'Cafe',
      positions: [
        [71.07442, 535.166016], [71.07442, 586.582031],
        [56.612375, 586.582031], [56.612375, 535.166016],
      ],
      markerPosition: [64.788443, 560.863037],
    },
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'Conference Room':
        return [[64.79389, 162.421875], [64.79389, 52.470703]];
      case 'Study Room 1':
        return [[42.231445, 277.910156], [35.893488, 277.910156], [35.893488, 153.632813], [64.850324, 153.632813], [64.807076, 52.613525]];
      case 'Study Room 2':
        return [[43.077674, 385.488281], [35.893488, 385.488281], [35.893488, 153.632813], [64.850324, 153.632813], [64.807076, 52.613525]];
      case 'Study Room 3':
        return [[43.077674, 470.039063], [35.893488, 470.039063], [35.893488, 153.632813], [64.850324, 153.632813], [64.807076, 52.613525]];
      case 'Male Bathroom':
        return [[43.077674, 512.402344], [35.893488, 512.402344], [35.893488, 153.632813], [64.850324, 153.632813], [64.807076, 52.613525]];
      case 'Female Bathroom':
        return [[76.763339, 518.203125],[79.401903, 518.203125],[79.401903, 374.0625], [84.706421, 374.0625],[84.706421, 606.09375]];
      case 'Multimedia Room':
        return [[72.818777, 432.421875],[79.368456, 432.421875],[79.401903, 374.0625], [84.706421, 374.0625],[84.706421, 606.09375]];
      case 'Mechanical Room':
        return [[72.818777, 316.582031],[79.368456, 316.582031],[79.368456, 374.0625], [84.706421, 374.0625],[84.706421, 606.09375]];
      case 'Cafe':
        return [[64.963007, 586.582031],[64.963007, 727.03125],[80.358287, 727.03125]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'Conference Room':
        return [[65.385777, 162.883301], [65.385777, 160.400391], [79.073255, 160.400391],[79.073255, 374.765625],[83.470981, 374.765625]];
        case 'Study Room 1':
          return [[42.231445, 279.910156],[35.893882, 279.910156], [35.893882, 354.550781],[35.893882, 608.203125],[64.963007,608.203125],[64.963007, 727.03125],[80.358287, 727.03125]];
        case 'Study Room 2':
          return [[43.077674, 387.630859], [35.893488, 387.630859], [35.893882, 387.630859],[35.893882, 608.203125],[64.963007,608.203125],[64.963007, 727.03125],[80.358287, 727.03125]];
        case 'Study Room 3':
          return [[43.077674, 472.039063], [35.893488, 472.039063], [35.893882, 472.039063],[35.893882, 608.203125],[64.963007,608.203125],[64.963007, 727.03125],[80.358287, 727.03125]];
        case 'Male Bathroom':
          return [[43.077674, 514.402344], [35.893488, 514.402344], [35.893882, 514.402344],[35.893882, 608.203125],[64.963007,608.203125],[64.963007, 727.03125],[80.358287, 727.03125]];
        case 'Female Bathroom':
          return [[76.721112, 520.048828],[79.400361,520.048828],[79.400361, 591.328125],[64.963007, 591.328125],[64.963007, 727.03125],[80.358287, 727.03125]];
        case 'Multimedia Room':
          return [[72.818777, 434.421875],[79.368456, 434.421875],[79.400361,520.048828],[79.400361, 591.328125],[64.963007, 591.328125],[64.963007, 727.03125],[80.358287, 727.03125]];
        case 'Mechanical Room':
          return  [[72.818777, 314.582031],[79.368456, 314.582031],[79.36845, 160.334473],[64.79389, 160.400391],[64.79389,  160.411377], [64.79389, 52.470703]];
        case 'Cafe':
          return [[66.017824, 586.625977],[66.017824, 590.185547],[79.497596, 590.185547],[79.401903, 518.203125],[79.401903, 374.0625], [84.706421, 374.0625],[84.706421, 606.09375]];

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
  const MapClickHandler = () => {
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
   //END CLICK PARA COORDENADAS SOLO PARA DEVELOPING-----------------------------------------------------------------------------------
return (
  
  <div className='leafletcss1'>   
    <MapContainer center={[64.754823, 400.429688]} zoom={1}>
      <h1 className='title-lc'>Learning Commons</h1>
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
<MapClickHandler />{/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default LearningCommons;