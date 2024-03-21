import React, {useState, useRef}  from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
import imagenmapa from "../../images/Ismul_leaflet_PN.png";
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui';

const ISMUL = () => {
    const bounds = [[-90, -90], [1800, 880]];
    const mapRef = useRef(null); // Reference to the map instance

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
    [-45.300517, 50.273438],[42.532186, 155.390625],[-37.684439, 221.132813],[-59.498489, 351.210938],
    [-26.087244, 411.328125],[8.062593, 432.421875],[29.522005, 751.289063]
   
 
   ];
 
   const PullStationLocations = [
    [24.836667, 799.453125],[-60.374136, -3.867188]
   
 
   ];
 
   const MeetingPointLocations = [
    [81.341117, -50.625000],[83.984598, 829.687500]
  
    
   ];

    //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'ISMUL AC336',
      positions: [
        [75.408, -18.105],[-24.072, -18.457],[-24.034, 29.003],[-56.276, 30.410],
       [-56.324, 53.876],[75.319, 54.492],
    ],
    markerPosition: [30.765, 20.390],
    },

    {
        name: 'AC337',
        positions: [
          [-28.224, -18.457],[-56.052, -18.457],[-55.958, 27.421],[-28.075, 25.576],
      ],
      markerPosition: [-44.312, 2.812],
    },

    {
      name: 'AEL AC335',
      positions: [
        [35.226, 61.171],[-56.323, 60.292],[-56.323, 164.882],[36.305, 165.058],
    ],
    markerPosition: [-17.212, 111.093],
    },
    
  {
      name: 'ISMUL AC334',
      positions: [
       [75.269, 60.292],[40.097, 60.292],[40.765, 183.867],[75.366, 183.339],
      ],
     markerPosition: [62.772, 121.816],
    },

    {
        name: 'Laboratorio de Anatomia AC333',
        positions: [
        [75.372, 219.902],[-56.361, 219.375],[-56.263, 316.757],[45.025, 316.406],[44.651, 283.886],[75.283, 283.710],
        ],
        markerPosition: [20.242, 254.531],
    },

    {
        name: 'Laboratorio de Fisica AC332',
        positions: [
        [75.376, 287.753],[47.701, 287.929],[47.226, 322.207],[-55.906, 322.207],[-55.988, 414.931],[75.322, 415.019],
        ],
        markerPosition: [18.182, 365.625],
    },

    {
        name: "AC 331B",
        positions: [
            [75.238, 421.171],[23.501, 420.820],[24.464, 520.136],[75.461, 519.960],
        ],
        markerPosition: [56.112, 469.863],

    },

    {
        name: "AC 331A",
        positions: [
            [20.970, 436.640],[-55.927, 436.113],[-55.829, 519.960],[21.950, 520.312],
        ],
        markerPosition: [-17.939, 476.542],
    },

    {
        name: "INGLES",
        positions: [
            [31.434, 665.156],[-36.912, 723.603],[11.786, 773.437],[59.749, 706.201],
        ],
        markerPosition: [13.956, 716.835],
    }


   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'ISMUL AC336':
        return [[-58.517340, 41.484],[-66.838475, 41.484],[-66.838475, -48.515],[-16.253189, -47.812],
        [-16.253189, -61.523],[-56.702969, -61.523]];

      case 'AC337':
        return [[-43.821627, 30.849],[-43.821627, 41.220],[-58.517340, 41.484],[-66.838475, 41.484],[-66.838475, -48.515],[-16.253189, -47.812],
        [-16.253189, -61.523],[-56.702969, -61.523]];
    
      case 'AEL AC335':
        return [[-59.421859, 158.906],[-66.838475, 158.906],[-66.838475, 41.484],[-66.838475, -48.515],[-16.253189, -47.812],
        [-16.253189, -61.523],[-56.702969, -61.523]];

      case 'ISMUL AC334':
        return [[44.578445, 120.937500],[44.578445, 183.515625],[36.849865, 198.984375],[27.034665, 176.484375],[-66.838475, 176.132813],
        [-66.838475, -48.515],[-16.253189, -47.812],[-16.253189, -61.523],[-56.702969, -61.523]];

      case 'Laboratorio de Anatomia AC333':
        return [[-58.985141, 227.812500],[-67.054053, 227.812500],[-66.838475, -48.515],
        [-16.253189, -47.812],[-16.253189, -61.523],[-56.702969, -61.523]];
    
      case 'Laboratorio de Fisica AC332':
        return [[-60.083680, 400.078125], [-67.077130, 400.078125],[-66.838475, -48.515],
        [-16.253189, -47.812],[-16.253189, -61.523],[-56.702969, -61.523]];

      case 'AC 331A':
        return [[-54.394750, 433.828125],[-54.394750, 424.335938],[-59.731426, 424.6875],[-67.349228, 424.6875],[-66.838475, -48.515],
        [-16.253189, -47.812],[-16.253189, -61.523],[-56.702969, -61.523]];

      case 'AC 331B':
        return [[19.533696, 424.335938],[-67.349228, 424.6875],[-66.838475, -48.515],
        [-16.253189, -47.812],[-16.253189, -61.523],[-56.702969, -61.523]];

      case 'INGLES':
        return [[1.740282, 771.679688],[-6.685300, 783.28125],[37.439265, 825.46875],[78.138593, 825.46875]];


        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'ISMUL AC336':
        return [[-59.684382, 48.867188],[-67.177415, 49.218750],[-67.177415, 169.453125],[-67.177415, 692.226563],
        [39.064427, 833.554688],[64.706440, 833.203125]];

      case 'AC337':
        return [[-44.079365, 34.101563],[-44.079365, 48.867188],[-59.684382, 48.867188],[-67.177415, 49.218750],[-67.177415, 169.453125],[-67.177415, 692.226563],
        [39.064427, 833.554688],[64.706440, 833.203125]];

      case 'AEL AC335':
            return [[-58.247482, 158.906250],[-58.247482, 159.609375],[-67.177415, 169.453125],[-67.177415, 178.945313],[-67.177415, 692.226563],
            [39.064427, 833.554688],[64.706440, 833.203125]];
    
      case 'ISMUL AC334':
            return [[46.81964, 125.859375],[46.81964, 183.867188],[35.713118, 201.796875],[23.197934, 179.648438],[-67.177415, 179.648438],[-67.177415, 692.226563],
            [39.064427, 833.554688],[64.706440, 833.203125]];
    
          case 'Laboratorio de Anatomia AC333':
            return [[-60.446018, 232.382813],[-67.502499, 232.382813],[-67.177415, 692.226563],
            [39.064427, 833.554688],[64.706440, 833.203125]];

          case 'Laboratorio de Fisica AC332':
            return [[-60.162698, 402.890625],[-67.177415, 402.890625],[-67.177415, 692.226563],[39.064427, 833.554688],[64.706440, 833.203125]];
    
          case 'AC 331A':
            return [[-52.917966, 434.707031],[-52.917966, 420.820313],[-67.177415, 419.589844],[-67.177415, 692.226563],[39.064427, 833.554688],[64.706440, 833.203125]];
    
          case 'AC 331B':
            return [[19.298082, 421.523438],[-67.177415, 421.523438],[-67.177415, 419.589844],[-67.177415, 692.226563],[39.064427, 833.554688],[64.706440, 833.203125]];

          case 'INGLES':
            return [[-2.876769, 770.273438],[-11.590883, 770.273438],[-65.681389, 704.882813],[-65.681389, 522.421875],[-65.681389,-47.109375],[-22.679707, -47.109375],
            [-22.679707, -61.875],[-59.592517, -61.875000]];
    
        
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
       
    <MapContainer center={[15.166345, 389.53125]} zoom={1}ref={mapRef}>
        <ImageOverlay url={imagenmapa} bounds={bounds} />

        <h1 className='title-lc'>ISMUL, Salones AC331-337 y Departamento de Ingles</h1>

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
<MapClickHandler />  {/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default ISMUL;
