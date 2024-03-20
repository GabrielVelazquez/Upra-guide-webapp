import React from 'react';


//BOTON DE RECENTER       USA INFO vvv
const RecenterButton = ({ handleCenterMap, center, zoom }) => {
  return (
    <button
      className='recenter-button'
      onClick={() => handleCenterMap(center, zoom)}
    >
      <img
        src="https://cdn4.iconfinder.com/data/icons/maps-navigation-24/24/target_destination_current_location_place_focus_recenter-512.png"
        alt="Center Map"
        style={{ width: '60px', height: '60px' }}
      />
    </button>
  );
};

export default RecenterButton;
