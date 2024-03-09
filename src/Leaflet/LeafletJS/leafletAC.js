import React, { useState } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, useMapEvents } from 'react-leaflet';  // usemap events IMAGE COORDINATES
import L from 'leaflet'; //IMAGE COORDINATES
import imagenmapa from '../../images/AC_nivel1_leaflet_PN.png';
import "../LeafletCSS/leafletAC.css";

const AC1 = () => {
  const bounds = [[0, 0], [1592, 807]];

   // Coordenadas del polígono (ejemplo)
  const AC108 = [
    [84.45737, 406.578073], [84.45737, 482.68133],
    [76.998357, 481.978298], [76.998357, 405.347766],
  ];

  //definir nombre de rutas de salida
  const [pathLineCoordsAC108, setPathLineCoordsAC108] = useState([]);

//definir poligonos para areas
  const handlePolygonAC108Click = () => {
    setPathLineCoordsAC108(AC108);
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
    <div className='leafletAC'>
      <MapContainer center={[64.754823, 404.927032]} zoom={1} >
          {/* overlay de la imagen */}
        <ImageOverlay
          url={imagenmapa}
          bounds={bounds}
          shouldUpdate={mapClicked}
        />

      <h1 className='title-ac' >Salones Nivel AC 100</h1>
        {/*--------------------------------Polígono overlay para AC108------------------*/}
        <Polygon positions={AC108} color="yellow" eventHandlers={{ click: handlePolygonAC108Click }} />
         {/*--------------------------------Path line overlay para AC108-----------------*/}
        {pathLineCoordsAC108.length > 0 && <Polyline positions={[[74.012928, 445.048771], [74.109489, 777.583097]]} color="red" /> }
        {/*RUTA ALTERNA*/}
        {pathLineCoordsAC108.length > 0 && <Polyline positions={[[74.012143, 382.128158], [74.205444, 442.228956]]} color="BLUE" /> } 
        <MapClickHandler />{/*IMAGE COORDINATES*/}
      </MapContainer>
    </div>
  );
};

export default AC1 ;
