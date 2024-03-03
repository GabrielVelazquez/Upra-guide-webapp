import React, { useState } from 'react';
import { MapContainer, ImageOverlay, useMapEvents } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet library
import imagenmapa from './images/Learning_common_leaflet_Test.png'; // Replace with the correct path
import "./leaflet1.css";

const BuildingMap = () => {
  // bounds para la imagen en overlay
  const bounds = [[0, 0], [1186, 627]];

  //bound segun el width y height 
  //const center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];

  const [mapClicked, setMapClicked] = useState(false);

  //--------------------CLICK PARA COORDENADAS SOLO PARA DEVELOPING
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
      <MapContainer center={[61.441814, 307.96875]} zoom={1} >
        {/* overlay de la imagen */}
        <ImageOverlay
          url={imagenmapa}
          bounds={bounds}
          shouldUpdate={mapClicked} 
        />
        {/*del lng y lat check de dev, se borra despues*/}
        <MapClickHandler />
      </MapContainer>
    </div>
  );
};

export default BuildingMap;
