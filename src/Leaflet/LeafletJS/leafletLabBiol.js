import React, {useState, useRef}  from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint, customInflamable} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
import imagenmapa from "../../images/LabsBiologia_leaflet.png";
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui';

const LabBiol = () => {
    const bounds = [[-85, -85], [1400, 400]];
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
    [-52.778686, 107.578125],[4.373821, 136.40625],[40.006438, 98.437500],[58.866148, 135.000000],[83.198053, 53.4375]
   ];
 
   const PullStationLocations = [
    [-26.255009, 155.390625]
   ];
 
   const MeetingPointLocations = [
    [-64.061315, 112.500000],[85.781214, 242.578125]
   ];

   const InflamableLocations = [
    
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
        return [];

      

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
{/*Hace render a los markers icons (Pull statuions)*/}
{InflamableLocations.map((position, index) => ( 
           <Marker key={index} position={position} icon={InflamableLocations}></Marker> 
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