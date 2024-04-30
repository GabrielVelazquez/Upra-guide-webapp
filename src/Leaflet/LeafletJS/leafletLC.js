import React, { useState,useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline,  Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
//import L from 'leaflet';
// import imagenmapa from '../../images/Learning_common_leaflet_PN.png';
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';

const LearningCommons = () => {
  const bounds = [[-90, -90], [1800, 880]];
  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FLearning_common_leaflet_PN.png?alt=media&token=6c6e623b-9b1b-4872-9698-d1840b167724'
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
    [29.791780, 251.455078], //center
    [-43.915607, 572.519531],//southeast
    [78.444373, 313.154297],//north
    [20.087403, 725.009766],//east
    [-33.753612, -4.855957], //west
  ];

  const PullStationLocations = [
    [-27.420451, -16.435452], //west
    [78.304371, 290.390625],//north
    [9.394305, 737.314453],//east
  ];

  const MeetingPointLocations = [
    [-53.188156, -61.875000],
    [81.454114, 787.500000],
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
          (Estacionamiento Administración)
          </div>
          <div className="legend-item">
          <img src={meet} alt="Punto de reunión" />
          Puntos de reunión <br />
          (Estacionamiento Biblioteca)
        </div>
       
      </div>
    );
  };

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'Salon de conferencia',

      positions: [[59.46165, 110.126953],[59.46165, 231.943359],
      [-66.883523, 231.943359],[-66.883523, 109.6875]],

      markerPosition: [-8.162836, 170.156250],
    },
    {
      name: 'Salon de estudio 1',
      positions: [
        [-22.887863, 236.685329], [-22.887863, 357.704670],
        [-63.044315, 357.704670], [-63.044315, 236.685329],
      ],
      markerPosition: [-46.530305, 296.977518],
    },
    {
      name: 'Salon de estudio 2',
      positions: [
        [-22.887863, 363.503], [-22.887863,  420.877559],
        [-63.044315, 420.701823], [-63.044315, 363.503],
      ],
      markerPosition: [-47.687390, 391.975186],
    },
    {
      name: 'Salon de estudio 3',
      positions: [
        [-22.887863, 426.5678], [-22.887863,  484.623315],
        [-63.044315, 484.623315], [-63.044315, 426.5678],
      ],
      markerPosition: [-46.569907, 455.487046],
    },
    {
      name: 'Baño masculino',
      positions: [
        [-9.812769, 489.020556], [-9.812769,  547.585242],
        [-58.226966, 547.623652], [-58.226966, 520.334862],
        [-66.987635, 520.334862], [-66.987635, 489.020556],
      ],
      markerPosition: [-42.213520, 516.526615],
    },
    {
      name: 'Baño femenino',
      positions: [
        [59.583984,489.020556],[59.583984,519.259668],
        [48.320577, 519.259668],[48.320577, 547.708874],
        [-6.440680,  547.585242],[-6.440680, 489.368951],
      ],
      markerPosition: [28.749864, 516.308493],
    },
    {
      name: 'Multimedios',
      positions: [
        [32.500733,  410.293388], [32.500733, 484.623315],
        [-19.532214, 484.623315], [-19.532214, 410.293388],
      ],
      markerPosition: [7.459365, 446.816644],
    },
    {
      name: 'Cuarto de mecánica',
      positions: [
        [32.500733, 236.601563], [32.500733, 404.912109],
        [-19.532214, 404.912109], [-19.532214, 236.686472],
      ],
      markerPosition: [7.131042, 320.712891],
    },
    {
      name: 'Educacion a distancia',
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
      case 'Salon de conferencia':
        return [[-8.119559, 109.198545], [-8.119559, -55.893442]];
      case 'Salon de estudio 1':
        return [[-63.684333, 242.392056], [-70.270980, 242.392056], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Salon de estudio 2':
        return [[-63.684333, 368.572083], [-70.270980, 368.572083], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Salon de estudio 3':
        return [[-63.684333, 471.224208], [-70.270980, 471.224208], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Baño masculino':
        return [[-63.684333, 520.878210],[-63.684333, 526.786665], [-70.270980, 526.786665], [-70.270980, 92.969950], [-8.119559, 92.969950], [-8.119559, -55.893442]];
      case 'Baño femenino':
        return [[58.006535, 519.607061],[58.006535, 525.755532], [69.316662, 525.755532],[69.316662, 402.883430], [79.249045, 358.382453],[84.145701, 358.748084],[84.145701, 625.024416]];
      case 'Multimedios':
        return [[33.508736, 430.989916], [59.088991,430.989916], [79.249045, 358.382453],[84.145701, 358.748084],[84.145701, 625.024416]];
      case 'Cuarto de mecánica':
        return [[33.508736, 288.270756], [60.634542, 289.149433], [79.249045, 358.382453],[84.145701, 358.748084],[84.145701, 625.024416]];
      case 'Educacion a distancia':
        return [[-8.119559, 615.768089], [-8.119559, 783.249629],[70.422368, 783.249629]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'Salon de conferencia':
        return [[-8.076627, 92.851450], [67.843036, 92.851450], [67.843036, 358.748084],[84.145701, 358.748084],[84.145701, 625.024416]];
        case 'Salon de estudio 1':
          return [[-63.684333, 248.392056], [-70.270980, 248.392056], [-70.270980, 639.492188], [-8.119559, 639.492188],[-8.119559, 783.249629],[70.422368, 783.249629]]; //separado del primary ers7 posiciones
        case 'Salon de estudio 2':
          return [[-63.684333, 375.572083], [-70.270980, 375.572083], [-70.270980, 639.492188], [-8.119559, 639.492188],[-8.119559, 783.249629],[70.422368, 783.249629]];
        case 'Salon de estudio 3':
          return [[-63.684333, 478.572083], [-70.270980, 478.572083], [-70.270980, 639.492188], [-8.119559, 639.492188],[-8.119559, 783.249629],[70.422368, 783.249629]];
        case 'Baño masculino':
          return [[-61.684333, 520.532227],[-61.684333, 532.572083], [-70.270980, 532.572083], [-70.270980, 639.492188], [-8.119559, 639.492188],[-8.119559, 783.249629],[70.422368, 783.249629]];
        case 'Baño femenino':
          return [[54.232116, 520.224609],[54.232116, 534.023438],[66.245539, 533.847656],[66.399556, 634.570313],[-8.290991, 634.570313],[-8.119559, 634.570313], [-8.119559, 783.249629],[70.422368, 783.249629]];
        case 'Multimedios':
          return [[33.516880, 437.695313],[66.399556, 437.695313],[66.399556, 634.570313],[-8.290991, 634.570313],[-8.119559, 634.570313], [-8.119559, 783.249629],[70.422368, 783.249629]];
        case 'Cuarto de mecánica':
          return  [[33.381240, 282.392578],[67.888519,282.392578], [67.843036, 92.851450],[-8.076627, 92.851450],[-8.119559, -55.893442]];
        case 'Educacion a distancia':
          return [[3.984703, 616.113281],[3.984703, 630.703125],[68.057847, 630.703125],[68.057847, 525.755532],[68.057847, 402.883430], [79.249045, 358.382453],[84.145701, 358.748084],[84.145701, 625.024416]];

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
    <MapContainer center={[15.166345, 389.53125]} zoom={1} maxZoom={3}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Learning Commons</h1>
        <Legend/>
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
{/*<MapClickHandler /> */}{/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default LearningCommons;