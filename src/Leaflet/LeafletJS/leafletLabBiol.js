import React, {useState, useRef}  from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint, customInflamable} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
// import imagenmapa from "../../images/LabsBiologia_leaflet.png";
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui';

const LabBiol = () => {
    const bounds = [[-85, -85], [1400, 400]];
    const mapRef = useRef(null); // Reference to the map instance
    const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FLabsBiologia_leaflet.png?alt=media&token=6354f1bf-6694-4bbe-b9ad-b4f4e27aefaf'
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
    [-52.778686, 107.578125],[4.373821, 136.40625],[40.006438, 98.437500],[58.866148, 135.000000],[83.198053, 53.4375]
   ];
 
   const PullStationLocations = [
    [-26.255009, 155.390625]
   ];
 
   const MeetingPointLocations = [
    [-64.061315, 112.500000],[85.781214, 242.578125]
   ];

   const InflamableLocations = [
    [68.429686, 93.515625],[16.644491, 138.867188]
   ];

    //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
        name: 'LAB AC246',
        positions: [ 
            [83.374479, -64.160156],[83.374479, 149.0625],[65.592941, 149.0625],[65.592941, -64.160156]
        ],
        markerPosition: [76.854159, 28.828125],
    },
    {
        name: 'LAB AC247',
        positions: [ 
            [64.555312, -64.160156],[64.555312, 149.0625],[44.996848, 149.0625],[44.996848, -64.160156]
        ],
        markerPosition: [56.089057, 26.191406],
    },
    {
        name: 'LAB AC248',
        positions: [ 
            [42.106180, -64.160156],[42.106180, 149.0625],[30.193005, 149.0625],[30.193005, 97.558594],
            [-6.926363, 97.558594],[-6.926363, -64.160156]
        ],
        markerPosition: [18.810877, 24.960938],
    },
    {
        name: 'LAB AC249',
        positions: [
            [-10.067149, -64.160156],[-10.067149,97.558594],[-42.990197, 97.558594],[-42.990197, 149.0625],
            [-54.501015, 149.0625],[-54.501015, -64.160156]
        ],
        markerPosition:[-34.660537, 2.460938],
    }
    
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'LAB AC246':
        return [[81.777838, 152.226563],[81.777838, 181.054688 ],[-69.571465, 181.054688],[-82.727983, 306.562500],
        [-61.497206, 306.562500],[-61.497206, 142.031250]];

      case 'LAB AC247':
        return [[61.794685, 151.523438],[61.794685, 181.054688],[-69.571465, 181.054688],[-82.727983, 306.562500],
        [-61.497206, 306.562500],[-61.497206, 142.031250]];
      
      case 'LAB AC248':
        return [[33.792540, 151.523438],[33.792540, 181.054688],[-69.571465, 181.054688],[-82.727983, 306.562500],
        [-61.497206, 306.562500],[-61.497206, 142.031250]];
      
      case 'LAB AC249':
        return [[-47.410489, 152.226563],[-47.410489, 181.054688],[-69.571465, 181.054688],[-82.727983, 306.562500],
        [-61.497206, 306.562500],[-61.497206, 142.031250]];
      

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'LAB AC246':
        return [[81.777838, 152.226563],[84.609287, 224.296875]];

      case 'LAB AC247':
        return [[63.156846, 151.611328],[63.156846, 168.750000],[82.126096, 168.750000],[84.609287, 224.29687]];
      
      case 'LAB AC248':
        return [[35.700523, 150.820313],[35.700523, 168.750000],[82.126096, 168.750000],[84.609287, 224.29687]];
      
      case 'LAB AC249':
        return [[-45.761897, 152.314453],[-45.761897, 168.750000],[82.126096, 168.750000],[84.609287, 224.29687]];
        
         
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

        <h1 className='title-lc'>Laboratorios de Biologia</h1>

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
{/*Hace render a los markers icons (Pull statuions)*/}
{InflamableLocations.map((position, index) => ( 
           <Marker key={index} position={position} icon={customInflamable}></Marker> 
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

export default LabBiol;