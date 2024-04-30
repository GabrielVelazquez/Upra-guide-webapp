

// import imagenmapa from '../../images/DecanatoEstudiantes_leaflet_PN.png';



import React, { useState,useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline,  Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
//import L from 'leaflet';
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui'; // Import the RecenterButton component
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';

const Decanato = () => {
 
  const bounds = [[-110, -110], [100, 680]];

  const mapRef = useRef(null); // referencia del mapa donde esta
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FDecanatoEstudiantes_leaflet_PN.png?alt=media&token=33b68d89-d7ca-4d8f-a1a6-e2239822deb0';
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


//Coordenadas de los extintores-----------------------------------------------------------------------------------------------------------
  const ExtintorLocations = [
    [-31.181002, -2.109375], //ADEM
    [55.400136, 76.816406], //Entre COMU y Decanato
    [72.027132, 28.652344], //Afuera de COMU
    [41.244772, 503.789063], //Afuera de Seguridad ocupacional/cerca Asistencia
    [-68.911005, 349.453125], //Entre Registraduria y Consejeria
    [21.289374, 165.234375], //Afuera de Recaudaciones
    
    

  ];

  const PullStationLocations = [
   [78.915778, -34.453125], //Afuera de COMU
   [36.597889, 296.718750], //Cerca de Consejeria

  ];

  const MeetingPointLocations = [
    [82.126582, -27.421875],//Afuera de COMU/Decanato
    [35.765738, -96.328125],//Afuera de ADEM
    [84.405941, -9.843750], //Est Facultad 1 (Admisiones, Seguridad, Registraduria, Asistencia)
    
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
          (Estacionamiento Facultad 1) <br /> (Estacionamiento Administracion)
        </div>
       
      </div>
    );
  };

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'ADEM',
      positions: [
        [-35.090009, -84.726563], [-35.090009, 160.664063], [-84.066817, 160.664063], [-84.066817,-84.726563],
    ],
    markerPosition: [-67.552410, 19.335938],
    },
    {
      name: 'COMU',
      positions: [
        [70.973218, -84.726563], [70.973218,66.796875], [-34.176168, 66.796875], [-34.176168,-84.726563],
    ],
    markerPosition: [31.438825, -9.843750],
    },
    {
      name: 'ADMISIONES',
      positions: [
        [84.267172, 342.070313], [84.267172, 478.828125], [81.120388,478.828125], [81.120388, 505.195313],[77.767582, 505.195313],
        [77.767582, 473.378906],[65.146115, 473.378906],[65.146115,397.617188],[52.908902, 397.617188],[52.908902,342.070313]
    ],
    markerPosition: [76.351896, 406.054688],
    },
    {
      name: 'CONSEJERIA',
      positions: [
        [23.885838, 343.125000],[23.885838,416.953125],[47.279229, 416.953125],[47.279229,473.203125],[-49.724479, 473.203125],
        [-49.724479, 414.843750],[-41.640078, 414.843750],[-41.640078, 343.125000]],
    markerPosition: [-11.867351, 407.109375],
    },
    {
      name: 'ASISTENCIA ECONOMICA',
      positions: [
        [84.267172, 480.234375],[81.174491,480.234375],[81.174491,505.722656],[66.791909,505.722656],[66.791909,554.414063],
        [52.589701,554.414063],[52.589701, 663.222656],[84.267172, 663.222656]],
    markerPosition: [76.351896, 594.843750],
    },
    {
      name: 'SALUD Y SEGURIDAD OCUPACIONAL',
      positions: [[47.989922, 505.898438],[-28.767659, 505.898438],[-28.767659,606.796875],[-23.725012, 606.796875],
      [-23.725012,663.046875],[51.944265,663.046875],[51.944265,620.507813],[47.989922,620.507813]],
      markerPosition:[-1.406109, 575.859375],
    },
    {
      name: 'REGISTRADURIA',
      positions: [[-26.431228, 663.046875],[-83.979259, 663.046875],[-83.979259, 471.796875],[-83.979259, 412.910156],[-66.231457, 412.910156],[-66.231457, 471.796875],
      [-66.231457, 504.492188],[-30.145127, 504.492188],[-30.145127, 607.148438],[-26.431228, 607.148438]],
      markerPosition: [-69.162558, 577.265625],
    },
    {
      name: 'RECAUDACIONES',
      positions: [[70.959697, 67.851563],[70.959697,160.664063],[-34.741612, 160.664063],[-34.741612, 67.851563]],
      markerPosition: [25.165173, 114.609375],
    },
    {
      name: 'CONSEJERIA Y SERVICIOS PSICOLOGICOS',
      positions: [[-84.052561, 162.421875],[-64.320872,162.421875],[-64.320872,238.359375],[-57.891497, 238.359375],[-57.891497, 290.566406],
      [-71.187754,290.566406],[-71.187754,341.367188],[-74.959392,341.367188],[-74.959392,397.792969],[-84.052561, 397.792969]],
      markerPosition: [-78.903929, 279.843750],
    },
    {
      name: 'BAÑOS F/M',
      positions: [[84.284704, 204.433594],[84.284704, 340.839844],[71.524909, 340.839844],[71.524909, 204.433594]],
      markerPosition: [79.592349, 290.917969],
    }

  
    
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'ADEM':
        return [[-62.155262, -10.546875],[-62.155262,-100.898438],[30.173549, -100.898438]];
      
      case 'COMU':
        return [[34.425458, -9.843750],[80.307206, -9.843750]];
      
      case 'ADMISIONES':
        return [[65.658275, 404.296875],[83.400042, 404.296875],[83.400042, 383.203125],[84.706049,383.203125],
        [84.706049, 208.828125],[84.706049,30.937500]];

      case 'CONSEJERIA':
        return [[24.527135, 404.296875],[65.658275, 404.296875],[83.400042, 404.296875],[83.400042, 383.203125],[84.706049,383.203125],
          [84.706049, 208.828125],[84.706049,30.937500]];
      
      case 'ASISTENCIA ECONOMICA':
        return [[49.382373, 613.125],[49.382373, 530.156250],[58.170702, 530.156250],[58.170702, 404.296875],[65.658275, 404.296875],[83.400042, 404.296875],[83.400042, 383.203125],[84.706049,383.203125],
              [84.706049, 208.828125],[84.706049,30.937500]];  
      
      case 'SALUD Y SEGURIDAD OCUPACIONAL':
        return [[-3.864255, 505.546875],[-3.864255, 488.671875],[56.944974, 488.671875],[56.944974, 406.054688],
        [83.111071, 406.054688],[83.111071, 382.851563],[84.541361,382.851563],[84.541361,208.828125],[84.541361,30.937500]];

      case 'REGISTRADURIA':
        return [[-63.074866, 506.250000],[-63.074866, 488.671875],[56.944974, 488.671875],[56.944974, 406.054688],
        [83.111071, 406.054688],[83.111071, 382.851563],[84.541361,382.851563],[84.541361,208.828125],[84.541361,30.937500]];

      case 'CONSEJERIA Y SERVICIOS PSICOLOGICOS':
        return [[-64.320872, 196.875000],[79.935918, 196.875000],[79.935918,-13.007813]];
      
      case 'RECAUDACIONES':
        return [[37.439974, 161.718750],[37.439974, 176.484375],[76.100796, 176.484375],[76.100796, 3.164063]];
      
      case 'BAÑOS F/M':
        return [[79.687184, 204.082031],[79.687184,-16.347656]];
      
        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'ADEM':
        return [[-71.700088, -2.812500],[-71.700088, -16.523438],[77.623106,-16.523438]];
      
      case 'COMU':
        return [[34.425458, -9.843750],[-61.491836, -9.843750],[-61.491836, -96.679687],[30.173549, -96.679687]];
      
      case 'ADMISIONES':
        return [[65.658275, 404.296875],[47.989922, 404.296875],[47.989922, 319.042969],[55.178868, 319.042969],
          [55.178868, 183.515625],[80.297927, 183.515625],[80.297927, 1.406250]];
      
      case 'CONSEJERIA':
        return [[27.059126, 408.164063],[47.989922, 408.164063],[47.989922, 319.042969],[55.178868, 319.042969],
          [55.178868, 183.515625],[80.297927, 183.515625],[80.297927, 1.406250]];
     
      case 'ASISTENCIA ECONOMICA':
        return [[50.958427, 612.597656],[50.958427, 532.441406],[58.813742,532.441406],[58.813742, 409.570313],[39.232253, 409.570313],[39.232253,319.042969],
        [55.178868, 319.042969],[55.178868, 183.515625],[80.297927, 183.515625],[80.297927, 1.406250]];

      case 'SALUD Y SEGURIDAD OCUPACIONAL':
        return [[-3.864255, 505.546875],[-3.864255, 488.671875],[-52.696361, 488.671875],[-52.696361, 183.164063],
          [71.635993, 183.164063],[76.184995, 183.164063],[76.184995, -11.953125]];
      
      case 'REGISTRADURIA':
        return [[-63.074866, 506.250000],[-63.074866, 488.671875],[-56.170023,488.671875],[-56.170023,183.164063],
        [71.635993, 183.164063],[76.184995, 183.164063],[76.184995, -11.953125]];

      case 'CONSEJERIA Y SERVICIOS PSICOLOGICOS':
        return [[-64.320872, 194.501953],[81.281717, 194.501953],[81.281717,29.53125]];

      case 'RECAUDACIONES':
        return [[37.439974, 161.718750],[37.439974, 186.679688],[80.05805, 186.679688],[80.05805, 3.164063]];
      
      case 'BAÑOS F/M':
        return [[77.273855, 203.554688],[77.273855,5.273438]];

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
    <MapContainer center={[32.546813, 243.281250]} zoom={1}  ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                      {/*REFERENCIA DE CENTRALIZAR^^^*/}
      <ImageOverlay url={imagenmapa} bounds={bounds} />
      <h1 className='title-lc'>Decanato de estudiantes</h1>
      <Legend />
{/*Boton de centralizar===============================*/}
          <RecenterButton handleCenterMap={handleCenterMap} center={[32.546813, 243.281250]} zoom={1} />
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

export default Decanato;