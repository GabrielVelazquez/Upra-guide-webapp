import React, { useState,useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline,  Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
//import L from 'leaflet';
// import imagenmapa from '../../images/DeptEnfermeria_leaflet_PN.png';
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';

const DeptEnfermeria = () => {
  const bounds = [[-90, -90], [1700, 770]];
  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FDeptEnfermeria_leaflet_PN.png?alt=media&token=8f6c0f3e-eaa5-4bae-85e8-a385f52dcf7e'
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
    [-81.679933, 158.203125], // al lado bano
    [38.600259, 293.203125], // afuera oficina profesores
    [-65.146434, 455.625000], // lado secretaria
    [-80.378755, 519.257813],//secretaria
    
  ];

  const PullStationLocations = [
    [16.788220, -9.1406252], //izq
    [35.001967, 633.515625],// derecha
  ];

  const MeetingPointLocations = [
    [-81.577655, -49.218750], // est facultada 4
    [84.339727, 702.421875], // est administracion
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
          (Estacionamiento Facultad 4)<br /> (Estacionamiento Administracion)
        </div>
       
      </div>
    );
  };

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'Oficinas de Profesores',
      positions: [[77.473225, -17.226563],[77.473225, 310.078125],[44.773041, 310.078125],[44.773041, -17.226563]],
      markerPosition: [68.173671, 144.84375],
    },
    {
      name: 'Oficinas de Profesores 2',
      positions: [[77.473225, 313.681641],[77.473225, 644.062500],[44.773041, 644.062500],[44.773041, 313.681641]],
      markerPosition: [64.817004, 478.828125],
    },
    {
      name: 'Faculty Lounge',
      positions: [[9.984892, -16.875000],[9.984892, 144.843750],[-81.852075, 144.843750],[-81.852075, -16.875000]],
      markerPosition: [-58.692076, 63.281250],
    },
    {
      name: 'Oficina Secretaria',
      positions: [[-12.341417, 479.707031],[-12.341417, 560.390625],[-81.875904, 560.390625],[-81.875904, 479.707031]],
      markerPosition: [-63.440177, 518.203125],
    },
    {
      name: 'Oficina Director',
      positions: [[-62.989376, 313.769531],[-62.989376, 392.343750],[-81.863525, 392.343750],[-81.863525, 313.769531]],
      markerPosition: [-76.119218, 352.265625],
    },
    {
      name: 'Cuarto HVAC',
      positions: [[9.822816, 204.785156],[9.822816, 268.242188],[-81.881113, 268.242188],[-81.881113, 204.785156]],
      markerPosition: [-58.692076, 233.437500],
    },
    {
      name: 'Baños',
      positions: [[8.787721, 151.699219],[8.787721, 200.390625],[-71.089761, 200.390625],[-71.089761,  151.699219]],
      markerPosition: [-58.692076, 233.437500],
    },
    
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'Oficinas de Profesores':
        return [[38.324052, 260.507813], [31.115325, 260.507813],[31.115325, -48.164063],[-75.250972, -48.164063]];
      
      case 'Oficinas de Profesores 2':
        return [[37.271161, 348.046875],[31.115325, 348.046875],[31.115325, 703.828125],[81.565930, 703.828125]];
      
      case 'Faculty Lounge':
        return [[13.617901, 66.445313],[31.115325, 66.445313],[31.115325, -48.164063],[-75.250972, -48.164063]];
      
      case 'Oficina Director':
        return [[-62.400631, 373.710938],[-53.195175, 373.710938],[-53.195175, 276.855469],[31.115325, 276.855469],
        [31.115325, -48.164063],[-75.250972, -48.164063]];
      
      case 'Oficina Secretaria':
        return [[-11.435441, 524.882813],[31.115325, 524.882813],[31.115325, 703.828125],[81.565930, 703.828125]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'Oficinas de Profesores':
        return [[38.600722, 276.679688], [31.115325,279.140625],[31.115325, 703.828125],[81.565930, 703.828125]];
      
      case 'Oficinas de Profesores 2':
        return [[40.763097, 359.648438],[31.115325, 359.648438],[31.115325, -48.164063],[-75.250972, -48.164063]];
      
      case 'Faculty Lounge':
        return [[11.613898, 80.156250],[31.115325, 80.156250],[31.115325, 703.828125],[81.565930, 703.828125]];
      
      case 'Oficina Director':
        return [[-62.400631, 373.710938],[-54.480632, 373.710938],[-54.480632, 510.468750],[31.115325, 512.578125],
        [31.115325, 703.828125],[81.565930, 703.828125]];
      
      case 'Oficina Secretaria':
        return [[-11.068562, 512.578125],[31.115325, 512.578125],[31.115325, -48.164063],[-75.250972, -48.164063]];
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
    <MapContainer center={[9.939225, 319.921875]} zoom={1}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Departamento de Enfermeria</h1>
        <Legend />
{/*Boton de centralizar===============================*/}
          <RecenterButton handleCenterMap={handleCenterMap} center={[9.939225, 319.921875]} zoom={1} />
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

export default DeptEnfermeria;