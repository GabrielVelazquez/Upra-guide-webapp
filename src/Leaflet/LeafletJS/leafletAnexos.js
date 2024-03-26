import React, {useState, useRef}  from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
// import imagenmapa from "../../images/Anexos_leaflet.png";
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui';

const Anexos = () => {
    const bounds = [[-110, -110], [1400, 400]];
    const mapRef = useRef(null); // Reference to the map instance
    const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FAnexos_leaflet.png?alt=media&token=03306103-66a3-4f01-9830-2f6749123933'
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
    [75.458835, 117.070313],[-65.560615, 299.707031]
   
   ];
 
   const PullStationLocations = [
     //Anexos no tiene pull station
   ];
 
   const MeetingPointLocations = [
    [-83.719340, 212.343750],[-81.577134, 444.375000]
   ];

    //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'ANX 204',
      positions: [
        [83.480837, 150.292969],[83.480837, 221.660156],[76.318170, 221.660156],[76.318170, 150.292969],
    ],
    markerPosition: [80.330217, 183.164063],
    },
    {
      name: 'ANX 203',
      positions: [
        [83.401710, 69.960938],[83.401710, 141.855469],[76.280570, 141.855469],[76.280570, 69.960938],
    ],
    markerPosition: [80.239806, 107.226563],
    },
    {
      name: 'ANX 202',
      positions: [
        [83.398748, -11.777344],[83.398748, 62.226563],[76.155755, 62.226563],[76.155755, -11.777344],
    ],
    markerPosition: [80.362996, 24.609375],
    },
    {
      name: 'ANX 201',
      positions:[
        [83.462316, -98.789063],[83.462316, -18.105469],[76.155755, -18.105469],[76.155755, -98.789063],
      ],
      markerPosition: [80.274689, -56.601563],
    },
    {
      name: 'ANX 205',
      positions: [
        [83.362593, 230.449219],[83.362593, 306.562500],[76.115798, 306.562500],[76.115798, 230.449219],
      ],
      markerPosition: [80.481365, 268.945313]
    },
    {
      name: 'Primer Piso ANX 101-105',
      positions: [
        [75.765677, -100.371094],[75.765677, 307.441406],[71.703755, 307.441406],[71.703755, -100.371094]
      ],
      markerPosition:[72.874771, 78.750000]
    },
    {
      name: 'Salones',
      positions: [[-31.639011, -93.515625],[-31.639011, 104.765625],[-62.889063, 104.765625],[-62.889063, -93.515625]],
      markerPosition:[-51.108743, 7.031250]
    },
    {
      name: 'Salones/Oficinas',
      positions: [[-33.696749, 243.984375],[-33.696749, 393.925781],[-63.999895, 393.925781],[-63.999895, 243.984375]],
      markerPosition: [-53.496640, 299.882813]
    }
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'ANX 201':
        return [[75.854761, -25.664063],[74.031972, -25.664063],[74.031972, 178.59375],[-65.497193, 178.59375],[-83.643522, 217.968750]];

      case 'ANX 202':
        return [[75.934988, 56.601563],[73.880255, 56.601563],[73.880255, 178.59375],[-65.497193, 178.59375],[-83.643522, 217.968750]];
    
      case 'ANX 203':
        return [[75.902056, 136.40625],[74.036982, 136.40625],[74.036982, 178.59375],[-65.497193, 178.59375],[-83.643522, 217.968750]];

      case 'ANX 204':
        return [[75.902056, 214.277344],[74.465982, 214.277344],[74.465982, 178.59375],[-65.497193, 178.59375],[-83.643522, 217.968750]];

      case 'ANX 205':
        return[[75.892621, 235.371094],[74.026329, 235.371094],[74.026329, 178.59375],[-65.497193, 178.59375],[-83.643522, 217.968750]];

      case 'Primer Piso ANX 101-105':
        return [[70.975439, 85.429688],[24.310298, 85.429688],[24.310298, 122.695313],[-65.717059, 122.695313],[-83.643522, 217.968750]];
      
      case 'Salones':
        return [[-64.433331, 7.382813],[-67.166368, 7.382813],[-67.166368, 178.593750],[-83.643522, 217.968750]];
      
      case 'Salones/Oficinas':
        return [[-66.183669, 347.695313],[-83.959783, 225.351563]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'ANX 201':
        return [[75.854761, -25.664063],[74.031972, -25.664063],[74.031972, 178.59375],[-65.497193, 178.59375],[-82.816371, 437.343750]];

      case 'ANX 202':
        return [[75.934988, 56.601563],[73.880255, 56.601563],[73.880255, 178.59375],[-65.497193, 178.59375],[-82.816371, 437.343750]];
    
      case 'ANX 203':
        return [[75.902056, 136.40625],[74.036982, 136.40625],[74.036982, 178.59375],[-65.497193, 178.59375],[-82.816371, 437.343750]];

      case 'ANX 204':
        return [[75.902056, 214.277344],[74.465982, 214.277344],[74.465982, 178.59375],[-65.497193, 178.59375],[-82.816371, 437.343750]];

      case 'ANX 205':
        return[[75.892621, 235.371094],[74.026329, 235.371094],[74.026329, 178.59375],[-65.497193, 178.59375],[-82.816371, 437.343750]];

      case 'Primer Piso ANX 101-105':
        return [[70.975439, 85.429688],[24.310298, 85.429688],[24.310298, 122.695313],[-65.717059, 122.695313],[-82.816371, 437.343750]];
      
      case 'Salones':
        return [[-64.433331, 7.382813],[-67.166368, 7.382813],[-67.166368, 178.593750],[-82.816371, 437.343750]];
      
      case 'Salones/Oficinas':
        return [[-66.183669, 347.695313],[-81.849451, 443.671875]];
  
        
         
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
       
    <MapContainer center={[-1.953225, 128.671875]} zoom={1}ref={mapRef}>
        <ImageOverlay url={imagenmapa} bounds={bounds} />

        <h1 className='title-lc'>Salones Anexos</h1>

{/*Boton de centralizar===============================*/}
<RecenterButton handleCenterMap={handleCenterMap} center={[-1.953225, 128.671875]} zoom={1} />
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

export default Anexos;