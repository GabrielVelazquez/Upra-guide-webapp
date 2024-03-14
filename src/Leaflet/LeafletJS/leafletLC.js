import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
import imagenmapa from '../../images/Learning_common_leaflet_PN.png';
//import waypoint from '../../images/Leaflet_marker_upra.png';
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";

const LearningCommons = () => {
  const bounds = [[-90, -90], [1800, 880]];
 //= [[0, 0], [1592, 807]];

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

      positions: [[59.46165, 110.126953],[59.46165, 231.943359],
      [-66.883523, 231.943359],[-66.883523, 109.6875]],

      markerPosition: [-8.162836, 170.156250],
    },
    {
      name: 'Study Room 1',
      positions: [
        [-22.887863, 236.685329], [-22.887863, 357.704670],
        [-63.044315, 357.704670], [-63.044315, 236.685329],
      ],
      markerPosition: [-46.530305, 296.977518],
    },
    {
      name: 'Study Room 2',
      positions: [
        [-22.887863, 363.503], [-22.887863,  420.877559],
        [-63.044315, 420.701823], [-63.044315, 363.503],
      ],
      markerPosition: [-47.687390, 391.975186],
    },
    {
      name: 'Study Room 3',
      positions: [
        [-22.887863, 426.5678], [-22.887863,  484.623315],
        [-63.044315, 484.623315], [-63.044315, 426.5678],
      ],
      markerPosition: [-46.569907, 455.487046],
    },
    {
      name: 'Male Bathroom',
      positions: [
        [-9.812769, 489.020556], [-9.812769,  547.585242],
        [-58.226966, 547.623652], [-58.226966, 520.334862],
        [-66.987635, 520.334862], [-66.987635, 489.020556],
      ],
      markerPosition: [-42.213520, 516.526615],
    },
    {
      name: 'Female Bathroom',
      positions: [
        [59.583984,489.020556],[59.583984,519.259668],
        [48.320577, 519.259668],[48.320577, 547.708874],
        [-6.440680,  547.585242],[-6.440680, 489.368951],
      ],
      markerPosition: [28.749864, 516.308493],
    },
    {
      name: 'Multimedia Room',
      positions: [
        [32.500733,  410.293388], [32.500733, 484.623315],
        [-19.532214, 484.623315], [-19.532214, 410.293388],
      ],
      markerPosition: [7.459365, 446.816644],
    },
    {
      name: 'Mechanical Room',
      positions: [
        [32.500733, 236.601563], [32.500733, 404.912109],
        [-19.532214, 404.912109], [-19.532214, 236.686472],
      ],
      markerPosition: [7.131042, 320.712891],
    },
    {
      name: 'Cafe',
      positions: [
        [25.072865, 553.138062], [25.072865, 615.222941],
        [-38.629705, 615.222941], [-38.629705, 553.13806],
      ],
      markerPosition: [-7.925518, 584.107437],
    },
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'Conference Room':
        return [[-8.119559, 109.198545], [-8.119559, -55.893442]];
      case 'Study Room 1':
        return [[-63.684333, 242.392056], [-70.270980, 242.392056], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Study Room 2':
        return [[-63.684333, 368.572083], [-70.270980, 368.572083], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Study Room 3':
        return [[-63.684333, 471.224208], [-70.270980, 471.224208], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Male Bathroom':
        return [[-63.684333, 520.878210],[-63.684333, 526.786665], [-70.270980, 526.786665], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Female Bathroom':
        return [[58.006535, 519.607061],[58.006535, 525.755532], [69.316662, 525.755532],[69.316662, 402.883430], [79.249045, 358.382453],[84.145701, 358.748084],[84.145701, 625.024416]];
      case 'Multimedia Room':
        return [[33.508736, 430.989916], [59.088991,430.989916], [79.249045, 358.382453],[84.145701, 358.748084],[84.145701, 625.024416]];
      case 'Mechanical Room':
        return [[33.508736, 288.270756], [60.634542, 289.149433], [79.249045, 358.382453],[84.145701, 358.748084],[84.145701, 625.024416]];
      case 'Cafe':
        return [[-8.119559, 615.768089], [-8.119559, 783.249629],[70.422368, 783.249629]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'Conference Room':
        return [[-8.076627, 92.851450], [67.843036, 92.851450], [67.843036, 358.748084],[84.145701, 358.748084],[84.145701, 625.024416]];
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
  
//END CLICK PARA COORDENADAS SOLO PARA DEVELOPING/////////////////////////////////////////////////////////////////////
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
     <h1 className='title-lc'>Learning Commons</h1>
    <MapContainer center={[15.166345, 389.53125]} zoom={1}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
     
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