import React, {useState, useRef}  from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
// import imagenmapa from "../../images/dept_biol.png";
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';

const BIOL = () => {
    const bounds = [[-90, -90], [1800, 880]];
    const mapRef = useRef(null); // Reference to the map instance
    const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2Fdept_biol.png?alt=media&token=b60b59ac-c36f-41ef-978c-e803ae06f638'

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
   [16.679771, 508.359375]
 
   ];
 
   const PullStationLocations = [
   [-31.28007, 200.390625]
 
   ];
 
   const MeetingPointLocations = [
  [-5.282204, 766.406250], [-70.939233, 576.562500]
    
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
          (Estacionamiento Facultad 2 y 3)
        </div>
       
      </div>
    );
  };

    //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'Oficina 1',
      positions: [
        [65.952710, 72.773438], [49.530617, 5.800781], [25.339940, 74.794922],
       [50.412455, 140.449219],
    ],
    markerPosition: [52.536410, 67.500000],
    
    },

    {
      name: 'Oficina 2',
      positions: [
        [83.290, 547.382813], [72.676, 549.140625], [72.676, 644.062500],
       [83.340, 644.589844],
    ],
    markerPosition: [80.273480, 593.437500],
    },
    
  {
      name: 'BIOL',
      positions: [
       [71.303223, 310.957031], [71.529215, 485.244141], [-23.356941, 514.335938], [-23.513104, 303.398438],
      ],
     markerPosition: [42.124282, 404.296875],
    }
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'BIOL':
        return [[-24.520, 490.341],[-46.437, 486.562],[-50.594, 483.398],[-53.596, 286.875],[-71.208, 265.078],
        [-85.125, 419.062],[-74.547, 564.609]];

        case 'Oficina 1':
          return [[55.410, 130.781],[47.562, 475.312],[-24.520, 490.341],[-46.437, 486.562],[-50.594, 483.398],[-53.596, 286.875],[-71.208, 265.078],
          [-85.125, 419.062],[-74.547, 564.609]];

        case 'Oficina 2': 
          return [[71.423, 628.242],[46.609, 612.421],[47.606, 487.265],[-24.520, 490.341],[-46.437, 486.562],[-50.594, 483.398],[-53.596, 286.875],[-71.208, 265.078]
          ,[-85.125, 419.062],[-74.547, 564.609]];
      
        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'BIOL':
        return [[-17.770166, 497.812500],[-50.512126, 506.250000],[-50.715447, 606.093750],[-7.579993, 743.203125]];

        case 'Oficina 1':
        return [[53.224741, 132.363281],[44.667022, 282.656250],[44.667022, 480.937500],[-17.770166, 497.812500],[-50.512126, 506.250000],[-50.715447, 606.093750],[-7.579993, 743.203125]];

        case 'Oficina 2':
        return [[69.923308, 632.8125],[43.659093, 622.968750],[42.633955, 492.890625],[-17.770166, 497.812500],[-50.512126, 506.250000],[-50.715447, 606.093750],[-7.579993, 743.203125]];
        
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
        
    <MapContainer center={[15.166345, 389.53125]} zoom={1} ref={mapRef}>
        <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Departamento de Biologia </h1>
        <Legend />
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
{/*<MapClickHandler /> */}  {/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default BIOL;
 