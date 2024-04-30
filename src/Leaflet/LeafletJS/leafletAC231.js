import React, {useState, useRef}  from "react";
import { MapContainer, ImageOverlay, Polygon, Polyline,  Marker, Tooltip } from 'react-leaflet';
import {customMarker, customExtintor, customPullStation, customMeetingPoint} from './LeafletIcons';  // Import the custom marker icon
//import L from 'leaflet';
// import imagenmapa from "../../images/AC231_237_leaflet.png";
import "leaflet/dist/leaflet.css"; //Override de css leaflet og
import "../LeafletCSS/leafletMap.css";
import "../LeafletCSS/ToolTipCSS.css";
import {RecenterButton, ResetButton}from './leafletui';
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';
import exit from '../../images/icon_salida.png';
import altexit from '../../images/icon_alt_salida.png';


const AC231 = () => {
    const bounds = [[-90, -90], [1700, 890]];
    const mapRef = useRef(null); // Reference to the map instance
    const imagenmapa = 'https://firebasestorage.googleapis.com/v0/b/upra-guide.appspot.com/o/leafletImg%2FAC231_237_leaflet.png?alt=media&token=9a202a6a-207d-485d-a6e8-5a05d2598494'
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
    [79.224284, -8.4375],[27.771737, 0.703125],[-65.137160, 64.160156],[-59.170551, 108.984375],
    [-63.2257, 192.128906],[-33.551257, 219.375000],[-67.511553, 340.3125],[-32.963794, 445.078125],[-21.106592, 722.8125]
   
   ];
 
   const PullStationLocations = [
    [-68.304351, 33.046875],[-68.304351, 682.734375],[-50.592667, 820.546875]
    
   ];
 
   const MeetingPointLocations = [
    [-72.743130, -85.078125],[85.342729, 745.312500]
    
    
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
          (Estacionamiento Facultad 2)<br />(Estacionamiento Facultad 4)
        </div>
       
      </div>
    );
  };

    //COORDENADAS DE POLIGONOS(cuartos) y Markers (waypoint)---------------------------------------------------------------------------------
  const polygons = [
    {
      name: 'LAB AC237 A',
      positions: [
        [27.091, -1.406],[-63.879, -4.921],[-63.879, 85.781],[27.091, 86.835],
    ],
    markerPosition: [-15.721, 46.757],
    },
    {
        name: 'LAB AC237 B',
        positions: [
          [30.955, 86.660],[30.955, -0.351],[80.173, 0.878],[80.173, 88.945],
      ],
      markerPosition: [65.373, 41.132],
    },
    {
      name: 'LAB AC237 C',
      positions: [
        [80.341, -56.425],[80.341, -2.460],[-7.933, -5.537],[-7.933, -55.546],
    ],
    markerPosition: [37.918, -33.222],
    },
    {
     name: 'LAB AC236',
     positions: [
       [80.229, 93.515],[-63.877, 89.648],[-63.877, 167.167],[28.678, 168.398],[28.678, 212.167],[80.229, 212.607],
      ],
     markerPosition: [27.940, 143.789],
    },
    {
        name: 'Centro Computos Quimica',
        positions: [
        [26.607, 171.914],[26.607, 211.289],[-64.040, 209.531],[-64.040, 169.804],
        ],
        markerPosition: [-20.449756, 191.953125],
    },
    {
        name: "LAB AC235",
        positions: [
         [80.213, 216.914],[-64.143, 213.398],[-64.143, 259.101],[-46.789, 259.101],[-46.789, 298.564],[80.213, 302.343],
        ],
        markerPosition: [26.090, 256.640],

    },
    {
        name: "AC234",
        positions: [
            [-47.810, 261.123047],[-47.810, 298.564453],[-63.847, 298.125],[-63.847, 260.859375],
        ],
        markerPosition: [-53.585, 279.052],
    },
    {
        name: "AC233 A",
        positions: [
            [47.765, 304.277344],[47.765, 360.351563],[-63.741, 358.769531],[-63.741, 301.289063],
        ],
        markerPosition: [-6.288659, 330.820313],
    },
    {
        name: "AC233 B",
        positions: [
            [80.221, 306.386719],[80.221, 441.210938],[50.239, 439.628906],[50.239, 303.925781],
        ],
        markerPosition: [72.518722, 370.195313],
    },
    {
        name: "AC232",
        positions: [
            [47.682, 381.621094],[47.682, 438.574219],[-64.086, 436.816406],[-64.086, 378.808594],
        ],
        markerPosition: [-32.276536, 408.867188],
    },
    {
        name: "LAB IDIOMAS AC231",
        positions: [
            [80.323, 444.375000],[80.323, 532.617188],[-63.486, 531.210938],[-63.486, 440.507813],
        ],
        markerPosition: [32.580009, 484.101563],
    },
    {
        name: "FISI/QUIM",
        positions: [
            [35.786, 676.054],[65.075, 717.890625],[12.624, 782.578125],[-45.248785, 732.304688],
        ],
        markerPosition: [24.295453, 721.406250],
    },
    {
        name: "Bano F",
        positions: [
            [10.595, 536.484375],[10.595, 562.851563],[-58.353, 561.093750],[-58.353, 551.250],[-66.575, 551.250],[-66.575, 535.429688],
        ],
        markerPosition: [-32.718680, 547.734375],
    },
    {
        name: "Bano M",
        positions: [
            [10.595, 566.367188],[10.595, 591.328125],[-66.575, 592.031250],[-66.575, 575.507813],[-58.537, 575.507813],[-58.537, 566.015625],
        ],
        markerPosition: [-33.013722, 578.671875],
    }

  ];

//COORDENADAS DE RUTAS DE SALIDAS y nombre de salon (para el case)-------------------------------------------------------------------------
  const getPolylinePositions = (name) => {
    switch (name) {
      case 'LAB AC237 A':
        return [[-64.674351, 1.933594],[-72.212504, 1.933594],[-72.212504, -64.6875],[-72.212504, -60.46875]];
    
      case 'LAB AC237 B':
        return [[36.166767, 1.933594],[-64.674351, 1.933594],[-72.212504, 1.933594],[-72.212504, -64.6875],[-72.212504, -60.46875]
        ];
    
      case 'LAB AC237 C':
        return [[36.166767,-9.84375],[36.166767, 1.933594],[-64.674351, 1.933594],[-72.212504, 1.933594],
        [-72.212504, -64.6875],[-72.212504, -60.46875]
        ];
    
      case 'LAB AC236':
        return [[32.672043, 96.328125],[-60.801247, 96.328125],[-73.142056, 96.328125],
        [-73.142056, 1.933594],[-73.142056, -64.6875],[-73.142056, -60.46875]];
    
      case 'Centro Computos Quimica':
        return [[-64.712870, 202.675781],[-70.413904, 202.675781],[-70.413904, 88.945313],[-70.413904, -36.562500],
        [-70.413904, -60.46875]];

      case 'LAB AC235':
        return [[-64.276049, 221.835938],[-71.035598, 221.835938],[-71.035598, 88.945313],[-71.035598, -36.562500],[-71.035598, -60.46875]];
    
      case 'AC234':
        return [[-64.879199, 291.796875],[-73.190768, 291.796875],[-73.190768, 88.945313],[-73.190768, -36.562500],[-73.190768, -60.46875]];
    
      case 'AC233 B':
        return [[53.940051, 368.085938],[-66.04804, 368.085938],[-73.791044,368.085938],[-73.791044, 88.945313],[-73.791044, -36.562500],
        [-73.791044, -60.46875]];

      case 'AC233 A':
        return [[-59.843592, 354.726563],[-59.843592,368.085938],[-66.04804, 368.085938],[-73.791044,368.085938],
        [-73.791044, 88.945313],[-73.791044, -36.562500],[-73.791044, -60.46875]];
    
      case 'AC232':
        return [[-65.040782, 420.468750],[-72.207709, 420.468750],[-72.207709,88.945313],[-72.207709,-36.562500],[-72.207709, -60.46875]];
      
      case 'LAB IDIOMAS AC231':
        return [[-64.97659, 447.539063],[-70.938818, 447.539063],[-70.938818, 88.945313],[-70.938818, -36.562500],[-70.938818, -60.46875]];

      case 'Bano F':
        return [[-67.450462, 543.691406],[-75.603293, 543.691406],[-75.603293, 722.109375],[33.259967, 835.3125],
        [74.423648, 835.3125],[82.027952, 765.000000]];

      case 'Bano M':
        return [[-67.652225, 582.011719],[-75.603293,582.011719],[-75.603293, 722.109375],[33.259967, 835.3125],
        [74.423648, 835.3125],[82.027952, 765.000000]];

      case 'FISI/QUIM':
        return [[6.757254, 778.710938],[-2.710207, 805.429688],[74.423648, 835.3125],[82.027952, 765.000000]];

        default:
        return [];
    }
  };

  //COORDENADAS DE RUTAS DE SALIDAS Alternas------------------------------------------------------------------------
  const getAltPolylinePositions = (name) => {
    switch (name) {
        case 'LAB AC237 A':
            return [[25.187418, 4.921875],[38.281755, 4.921875],[38.281755, -32.695313],[81.609736, -32.695313]];
        
          case 'LAB AC237 B':
            return [[38.281755, 4.921875],[38.281755, -32.695313],[81.609736, -32.695313]];
        
          case 'LAB AC237 C':
            return [[38.281755, -32.695313],[81.609736, -32.695313]];
        
          case 'LAB AC236':
            return [[-50.592291, 94.921875],[-69.566296, 94.21875],[-69.566296, 708.750000],[40.553686, 836.015625],[80.427337, 836.015625]
            ,[82.858833, 742.5]];
        
          case 'Centro Computos Quimica':
            return [[-64.745397, 201.796875],[-69.933428, 201.796875],[-69.566296, 708.750000],[40.553686, 836.015625],[80.427337, 836.015625],[82.858833, 742.5]];
    
          case 'LAB AC235':
            return [[-64.969261, 227.285156],[-70.410007, 227.285156],[-70.410007, 708.925781],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
        
          case 'AC234':
            return [[-64.498501, 291.005859],[-70.422961, 291.005859],[-70.422961, 709.013672],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
        
          case 'AC233 B':
            return [[-60.200392, 354.375000],[-65.182755, 368.4375],[-72.991261, 372.656250],[-72.991261, 709.013672],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
    
          case 'AC233 A':
            return [[54.954493, 368.4375],[-65.182755, 368.4375],[-72.991261, 372.656250],[-72.991261, 709.013672],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
        
          case 'AC232':
            return [[-64.956692, 430.136719],[-71.517095, 430.136719],[-71.517095,709.013672],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
          
          case 'LAB IDIOMAS AC231':
            return [[-64.763742, 446.748047],[-71.175216, 446.748047],[-71.517095,709.013672],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
    
          case 'Bano F':
            return [[-67.326794, 547.03125],[-73.712523, 547.119141],[-73.712523,709.013672],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
    
          case 'Bano M':
            return [[-67.562581, 581.660156],[-72.566794, 581.660156],[-72.566794,709.013672],[41.723697, 841.816406],[77.296054, 843.046875],[81.419060, 748.828125]];
    
          case 'FISI/QUIM':
            return [[3.968845, 779.765625],[-7.945445, 795.234375],[-72.121261, 717.539063],[-72.121261, -54.843750]];
    
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
       
    <MapContainer center={[15.166345, 389.53125]} zoom={1}ref={mapRef}>
        <ImageOverlay url={imagenmapa} bounds={bounds} />

        <h1 className='title-lc'>Salones AC231-237 y Departamento de Fisica/Quimica</h1>
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

export default AC231;