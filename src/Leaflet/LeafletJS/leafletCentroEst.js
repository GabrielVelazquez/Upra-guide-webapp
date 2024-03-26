import React, { useState, useRef} from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip, 
    LayersControl, LayerGroup, SVGOverlay} from 'react-leaflet'; /* Popup,Circle,FeatureGroup,Rectangle, SVGOverlay*/ 
                                                            //LAYER CONTROL -----  ^IMAGE ON IMAGE
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
import L from 'leaflet';
// import imagenmapa from '../../images/centro_de_estudiantes_leaflet_PN.png';
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
// import imageURL from '../../images/centro_de_estudiantes_piso2_crop_leaflet_PN.png';
import {RecenterButton,ResetButton} from './leafletui'; // Import RecenterButton 


const CentroEstudiantes = () => {
  const bounds = [[-90, -90], [1800, 880]];
  const mapRef = useRef(null); // Reference to the map instance
  const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2Fcentro_de_estudiantes_leaflet_PN.png?alt=media&token=604100c1-eedc-4edb-afe0-9c01c3956520'
  const imageURL = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2Fcentro_de_estudiantes_piso2_crop_leaflet_PN.png?alt=media&token=aca1c722-ddbd-471a-a128-f9c39a718767'
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
    [74.151856, 292.500000], //norte centroest
    [-76.585160, 337.500000],//sur centroest
    [-46.515334, 246.093750],//servicios medicos
    [-73.808248, 45.878906]//servicios educativos
  ];

  const ExtintorLocations2 = [
    [57.960003, 386.718750], //piso 2
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

   
    {
      name: 'Male Bathroom',

      positions: [[-41.353104, 310.693359],[-41.353104, 367.207031],
    [-75.467890, 367.207031],[-75.467890, 291.884766],
  [-69.859194, 291.884766],[-69.859194, 310.693359]],

      markerPosition: [-63.989990, 335.390625],
    },
    {
      name: 'Female Bathroom',

      positions: [[45.013873, 294.257813],[45.013873, 334.335938],
    [-38.504845, 334.335938],[-38.504845, 293.203125],
  [-20.248470,  293.203125],[-20.248470, 253.652344],
  [34.652450, 253.652344],[34.652450, 294.257813]],

      markerPosition: [5.850766, 298.652344],
    },

    {
      name: 'Recreation Room',

      positions: [[45.234095, 372.282715],[45.234095, 438.398438],
    [-45.671358, 438.398438],[-45.794073, 372.282715]],

      markerPosition: [-0.649339, 405.175781],
    },

    {
      name: 'Servicios Educativos',

      positions: [[76.667397, -19.687500],[76.667397, 118.828125],
    [50.103286, 118.828125],[50.103286, 146.777344],
  [-3.800801,  146.777344],[-3.800801, 82.265625],
[-76.543647,  82.265625],[-76.543647, 130.605469],
[-82.062090, 130.605469],[-82.062090, -19.687500]],

      markerPosition: [-8.345782, 47.812500],
    },

    {
      name: 'Servicios Medicos',

      positions: [[76.667397, 124.233398],[76.667397,  335.039063],
      [47.795259, 334.335938],[47.795259, 289.160156],
      [38.450067, 289.160156],[38.450067, 247.675781],
      [-23.456841, 247.675781],[-23.456841, 288.369141],
      [-41.156164, 288.369141],[-41.156164, 305.771484],
      [-68.128187, 305.771484],[-68.226218, 287.402344],
      [-75.490894, 287.314453],[-75.305261, 171.210938],
      [-64.521303, 171.210938],[-63.986747, 88.417969],
      [-8.507096, 87.714844],[-8.173727, 152.578125],
      [53.158395, 152.226563],[53.368708, 124.453125]],

      markerPosition: [-8.201937, 195.996094],
    },
 
  ];
  

  const polygons2 = [
    {
      name: 'Tutorias Servicios Educativos',

      positions: [[76.573597, 215.507813],[76.450213, 404.296875],
      [5.643818, 404.296875],[5.818747, 371.953125],
      [47.657017, 371.425781],[47.360132, 333.896484],
      [-34.041690, 333.939142],[-34.477602, 368.128595],
      [-75.467810, 367.910156],[-75.526179, 215.200195]],

      markerPosition2: [8.300523, 296.998901],
    },
   
  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'Centro Estudiantil':
        return [[-10.773302, 588.164063], [-61.170862, 717.187500],[-75.200635, 755.156250],[-82.434056, 756.210938]];

      case 'Male Bathroom':
      case 'Female Bathroom':
      case 'Recreation Room':
        return [[-25.277845,  362.285156], [60.877502, 362.285156],[61.168455, 376.523438],[61.168455, 452.812500], [-60.467535, 720.000000],[-75.200635, 755.156250],[-82.434056, 756.210938]];

      case 'Servicios Educativos':
          return [[-81.057851, 135.000000], [-81.057851, 561.09375],[-43.914431, 665.15625],[-60.384733, 719.824219],[-75.171891, 755.156250],[-82.417921, 756.035156]];

          case 'Servicios Medicos':
            return [[-76.000872, 229.042969],[-80.974420,229.042969], [-81.057851, 561.09375],[-43.914431, 665.15625],[-60.384733, 719.824219],[-75.171891, 755.156250],[-82.417921, 756.035156]];   
        default:
        return [];
    }
  };

  const getPolylinePositions2 = (name) => {
    switch (name) {
      case 'Tutorias Servicios Educativos':
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
     
      case 'Male Bathroom':
      case 'Female Bathroom':
      case 'Recreation Room':
        return [[-25.111564, 345.937500],[65.392642, 345.937500],[77.015133, 374.941406],[81.020718, 375.732422],[80.972391, 191.030273]]
        
      case 'Servicios Educativos':
        return [[-78.993071, 135.000000], [-78.993071, 476.718750],[61.337792,476.718750],[61.168455, 452.812500],[61.168455, 376.523438],[80.994397, 375.820313, 375.468750],[81.007239, 190.898438]];
        
        case 'Servicios Medicos':
          return [[73.990322, 335.917969],[73.990322, 375.732422],[81.020718, 375.732422],[80.972391, 191.030273]];     
        default:
        return [];
    }
  };

  const getAltPolylinePositions2 = (name) => {
    switch (name) {
      case 'Tutorias Servicios Educativos':
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
    return polygons2.map((polygon2, index) => (  //color="yellow" //ESTA ROJO EN LO QUE VEO COMO ESCONDO LOS OTROS POLIGONOS
      <Polygon key={index} positions={polygon2.positions} color="red" eventHandlers={{ click: () => handlePolygonClick2(index) }}> {/*Yellow o #FFD703 (upraYellow)*/}
        {markerPosition2 && <Marker position={markerPosition2} icon={customMarker}></Marker>}

        {ExtintorLocations2.map((position, index) => ( //definir posicion como lo puse en el polygon
  <Marker key={index} position={position} icon={customExtintor}></Marker> //extintor de piso 2 se ve 
))}

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
    
    <MapContainer center={[15.166345, 395.53125]} zoom={1} ref={mapRef}> {/*ASEGURATE DE QUE ESTE EN EL MISMO MEDIO*/}
                                   {/*REFERENCIA DE CENTRALIZAR^^^*/}
        <ImageOverlay url={imagenmapa} bounds={bounds} />
        <h1 className='title-lc'>Centro de Estudiantes</h1>

{/*Boton de centralizar===============================*/}
<RecenterButton handleCenterMap={handleCenterMap} center={[15.166345, 395.53125]} zoom={1} />
{/*Boton de reset===============================*/}
  <ResetButton handleResetPolylines={handleResetPolylines} />

{/*render level 1---------------------------------------------------------------------------------------------------------------*/}
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
    {/*{hidelevel1poly} */}
    </LayerGroup>
  </LayersControl.Overlay>
</LayersControl>


{/*DEV ONLY IMAGE COORDINATES*/}
<MapClickHandler />{/*IMAGE COORDINATES*/}
{/*DEV ONLY IMAGE COORDINATES*/}

  </MapContainer>
</div>
  );
};

export default CentroEstudiantes;