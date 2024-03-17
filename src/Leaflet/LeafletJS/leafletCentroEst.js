import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip, 
    LayersControl, LayerGroup, SVGOverlay} from 'react-leaflet'; /* Popup,Circle,FeatureGroup,Rectangle, SVGOverlay*/ 
                                                            //LAYER CONTROL -----  ^IMAGE ON IMAGE
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
import imagenmapa from '../../images/centro_de_estudiantes_leaflet_PN.png';
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import imageURL from '../../images/centro_de_estudiantes_piso2_crop_leaflet_PN.png';

const CentroEstudiantes = () => {
  const bounds = [[-90, -90], [1800, 880]];

//Coordenadas de los extintores-----------------------------------------------------------------------------------------------------------
  const ExtintorLocations = [
    [74.151856, 292.500000],

  ];

  const PullStationLocations = [
    [-80.741777, 670.429688],
    [55.845945, 344.531250]

  ];

  const MeetingPointLocations = [
    [-84.844051, 757.265625],
    [81.345184, 101.250000]

  ];

  //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'Centro Estudiantil',

      positions: [[76.687641,  444.726563],[76.687641, 734.560893],
      [-53.293834, 734.560893],[-67.181678, 699.785156],
    [-81.789855, 699.433594],[-81.789855,  444.726563]],

      markerPosition: [-10.947542, 588.251953],
    },
   
  ];

  const polygons2 = [
    {
      name: 'Archivos',

      positions: [[76.573597, 215.507813],[76.450213, 404.296875],
      [5.643818, 404.296875],[5.818747, 371.953125],
      [47.657017, 371.425781],[47.360132, 333.896484],
      [-34.041690, 333.939142],[-34.477602, 368.128595],
      [-75.467810, 367.910156],[-75.526179, 215.200195]],

      markerPosition2: [-10.947542, 588.251953],
    },
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'Centro Estudiantil':
        return [[-13.678438, 588.515625], [-60.467535, 720.000000],[-75.200635, 755.156250],[-82.434056, 756.210938]];


        default:
        return [];
    }
  };

  const getPolylinePositions2 = (name) => {
    switch (name) {
      case 'Archivos':
        return [[4.980469, 378.281250], [-81.245764, 378.281250],[-81.245764, 484.453125]];


        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
      case 'Centro Estudiantil':
        return [[-10.773302, 588.164063],[61.168455, 452.812500],[61.168455, 376.523438],[80.994397, 375.820313, 375.468750],[81.007239, 190.898438]];
     
        default:
        return [];
    }
  };

  const getAltPolylinePositions2 = (name) => {
    switch (name) {
      case 'Archivos':
        return [[4.980469, 396.650391], [-79.486183, 396.650391],[-79.486183, 484.453125]];
     
        default:
        return [];
    }
  };


  //CONSTANTE DE MARKERS Y RUTAS DE SALIDAS (definir)----------------------------------------------------------------------------------------------
  const [markerPosition, setMarkerPosition] = useState(null); //marker invisible por default
  const [markerPosition2, setMarkerPosition2] = useState(null); //para piso 2
  const [pathLineCoords, setPathLineCoords] = useState([]); //path polyline ruta de salida
  const [pathLineCoords2, setPathLineCoords2] = useState([]); //para piso 2
  const [AltpathLineCoords, setAltPathLineCoords] = useState([]); //path polyline ruta de salida alterna
  const [AltpathLineCoords2, setAltPathLineCoords2] = useState([]); //para piso 2

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

  //MOSTRAR RUTA para piso 2-----------------------------------------------------------------------------------------------------
  const handlePolygonClick2 = (index) => {
    const polygon2 = polygons2[index];
  
if (polygon2) {
        console.log("Polygon name:", polygon2.name); //para debugging

      const polylinePositions2 = getPolylinePositions2(polygon2.name);//principal
        console.log("Polyline positions:", polylinePositions2); //para debugging
      const AltpolylinePositions2 = getAltPolylinePositions2(polygon2.name);//alterna
        console.log("Polyline positions:", AltpolylinePositions2); //para debugging

       setPathLineCoords2(polylinePositions2); //mustra ruta de salida
       setAltPathLineCoords2(AltpolylinePositions2); //mustra ruta de salida alterna
       setMarkerPosition2(polygon2.markerPosition2);  //muestra marker
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

//PARA PISO 2
//MUESTRA POLIGONO OVERLAY PARA LOCATION----------------------------------------------------------------------------------------------------
const renderPolygons2 = () => {
    return polygons2.map((polygon2, index) => (
      <Polygon key={index} positions={polygon2.positions} color="yellow" eventHandlers={{ click: () => handlePolygonClick2(index) }}> {/*Yellow o #FFD703 (upraYellow)*/}
        {markerPosition && <Marker position={markerPosition2} icon={customMarker}></Marker>}
        <Tooltip direction="bottom" offset={[0, 1]} opacity={1} permanent iconSize="fixed">
          <div>
            <span> ● {polygon2.name}</span> 
          </div>
        </Tooltip>
      </Polygon>
    ));
  };
  
  const NivelLayer = (
    <div style={{ position: 'absolute', top: -12, right: 50, padding: 15, fontSize:15, color:'black'}}>
      <p>Show 2nd level</p>
    </div>
  );
  
//END CLICK PARA COORDENADAS SOLO PARA DEVELOPING/////////////////////////////////////////////////////////////////////
  //const [mapClicked, setMapClicked] = useState(false);   //IMAGE COORDINATES   //const [mapClicked, setMapClicked]
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
     <h1 className='title-lc'>Centro de Estudiantes</h1>
    <MapContainer center={[15.166345, 395.53125]} zoom={1}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
    
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

<LayersControl position="topright">
  <LayersControl.Overlay name="Second level">
  <LayerGroup>
    <ImageOverlay  url={imageURL} bounds = {[[-76.358727, 207.377930], [77.747603,412.757813]]}  />
    {renderPolygons2()}
    <Polyline positions={pathLineCoords2} color="red" /> {/*rutas de salida*/}
    <Polyline positions={AltpathLineCoords2} color="red" dashArray="10, 10"/>{/*dashArray style para lineas entre cortadas (alt)*/}
    <SVGOverlay  bounds={bounds}>
      <text x="47%" y="6%" fill="#F1393A" fontWeight={'bold'} fontSize={30}>
        Level 2
      </text>
    </SVGOverlay>
    {NivelLayer}
    </LayerGroup>
  </LayersControl.Overlay>
</LayersControl>



{/**************************************************/}
 {/*
<LayersControl position="topright">
      <LayersControl.Overlay name="Segundo Nivel">

      <ImageOverlay url={imageURL} bounds={bounds} />

    } <SVGOverlay attributes={{ stroke: 'red' }} bounds={bounds}>
      <rect x="430" y="95" width="20%" height="65%" fill="blue" />
      <text x="450" y="50%" stroke="white">
        Nivel 2
      </text>
    </SVGOverlay>
    * /}

        {/*<Marker icon={customExtintor} position={center}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        * /}
      </LayersControl.Overlay>

      <LayersControl.Overlay checked name="Layer group with circles">
        <LayerGroup>
          <Circle
            center={center}
            pathOptions={{ fillColor: 'blue' }}
            radius={200}
          />
          <Circle
            center={center}
            pathOptions={{ fillColor: 'red' }}
            radius={100}
            stroke={false}
          />
          <LayerGroup>
            <Circle
              center={[51.51, -0.08]}
              pathOptions={{ color: 'green', fillColor: 'green' }}
              radius={100}
            />
          </LayerGroup>
        </LayerGroup>
      </LayersControl.Overlay>

      <LayersControl.Overlay name="Feature group">
        <FeatureGroup pathOptions={{ color: 'purple' }}>
          <Popup>Popup in FeatureGroup</Popup>
          <Circle center={[51.51, -0.06]} radius={200} />
          <Rectangle bounds={rectangle} />
        </FeatureGroup>
      </LayersControl.Overlay>
    </LayersControl>
    { / ************************************************** / }

    */}

{/*DEV ONLY IMAGE COORDINATES*/}
<MapClickHandler />{/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default CentroEstudiantes;