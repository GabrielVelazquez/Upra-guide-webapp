import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents, Marker, Tooltip} from 'react-leaflet';  // usemap events IMAGE COORDINATES
import L from 'leaflet'; //IMAGE COORDINATES
import imagenmapa from '../../images/Learning_common_leaflet_PN.png';
import "../LeafletCSS/leafletLC.css";
import "../LeafletCSS/ToolTipCSS.css"; //CSS para el tooltip/nombre de location

import waypoint from '../../images/Leaflet_marker_upra.png';

const LearningCommons = () => {
  const bounds = [[0, 0], [1592, 807]];
  
  const customIcon = new L.Icon({
    iconUrl: waypoint,
    iconSize: [50, 50],
    iconAnchor: [24, 50],
    popupAnchor: [0, -50],
  });

  //----------------------------------------------------------------------------- Coordenadas del polígono (ejemplo)
  const polygonSalonGrande = [
    [77.920958, 163.035113], [77.716721, 268.45804],
    [40.497613, 268.062391], [40.622979, 163.035113],
  ];

  const polygonSalonMediano = [
    [61.336472, 271.647949], [61.336413, 372.513428],
    [43.397134, 372.875977], [43.397134, 271.647949],
  ];

  //CONSTANTE DE RUTAS DE SALIDAS--------------------------------------------------------------------------------------------------------
  const [pathLineCoordsSalonGrande, setPathLineCoordsSalonGrande] = useState([]);
  const [pathLineCoordsSalonMediano, setPathLineCoordsSalonMediano] = useState([]);
  const [markerPosition, setMarkerPosition] = useState(null); //marker invisible por default

  //MOSTRAR RUTA CUANDO SE SELECCIONA--------------------------------------------------------------------------------------------------------
  const handlePolygonSalonGrandeClick = () => {
    setPathLineCoordsSalonGrande(polygonSalonGrande);
    setPathLineCoordsSalonMediano([]); // Resetea linea para que sea una a la vez
    setMarkerPosition([65, 215]); // la position for salon grande (el medio de los poligonos)
  };

  const handlePolygonSalonMedianoClick = () => {
    // muestra la linea path del poligono marcado
    setPathLineCoordsSalonMediano(polygonSalonMediano);
    setPathLineCoordsSalonGrande([]);
    setMarkerPosition([52,322]); // Set the marker position for salon mediano
  };

  const [mapClicked, setMapClicked] = useState(false);//IMAGE COORDINATES

  //--------------------CLICK PARA COORDENADAS SOLO PARA DEVELOPING //IMAGE COORDINATES
  const popup = L.popup();
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
          // solo para re render el mapa despues de click
        setMapClicked(!mapClicked);
      },
    });
    return null;
  };
   //--------------------END CLICK PARA COORDENADAS SOLO PARA DEVELOPING

  return (
    
    <div className='leafletcss1'>
      <MapContainer center={[64.754823, 404.927032]} zoom={1} >
          <h1 className='title-lc' >Learning Commons</h1>
          {/* overlay de la imagen */}
        <ImageOverlay
          url={imagenmapa}
          bounds={bounds}
          shouldUpdate={mapClicked}
        />
        
{/*---------------------------------------------------------------------------------Polígono overlay para salon grande------------------*/}
        <Polygon positions={polygonSalonGrande} color="yellow" eventHandlers={{ click: handlePolygonSalonGrandeClick }}>

        {markerPosition && <Marker position={markerPosition} icon={customIcon}></Marker>}

        <Tooltip direction="bottom" offset={[0, 1]} opacity={1} permanent iconSize="fixed">
            <div >
              <span> ● Salon grande</span>
            </div>
          </Tooltip>

        </Polygon>
         {/*--------------------------------Path line overlay para salon grande-----------------*/}
        {pathLineCoordsSalonGrande.length > 0 && <Polyline positions={[[65.299095, 162.421875], [65.299095, 43.59375]]} color="red" />}
      
{/*-------------------------------------------------------------------------------Polígono overlay para salon mediano------------------*/}
        <Polygon positions={polygonSalonMediano} color="yellow" eventHandlers={{ click: handlePolygonSalonMedianoClick }} >
        {markerPosition && <Marker position={markerPosition} icon={customIcon}></Marker>}

        <Tooltip direction="bottom" offset={[0, 1]} opacity={1} permanent iconSize="fixed">
            <div >
              <span> ● Salon mediano</span>
            </div>
          </Tooltip>
          </Polygon>
         {/*--------------------------------Path line overlay para salon mediano-----------------*/}
        {pathLineCoordsSalonMediano.length > 0 && <Polyline positions={[[42.231445, 277.910156],[35.893488, 277.910156], [35.893488, 153.632813],[64.855249, 134.648438],[65.299095, 43.59375]]}  color="red" />}

        <MapClickHandler />{/*IMAGE COORDINATES*/}
      </MapContainer>
    </div>
  );
};


export default LearningCommons;
