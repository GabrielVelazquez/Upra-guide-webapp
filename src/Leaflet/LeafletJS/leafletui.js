import React from 'react';

//BOTON DE RECENTER       USA INFO vvv
const RecenterButton = ({ handleCenterMap, center, zoom }) => {
  return (
    <button className='recenter-button' onClick={() => handleCenterMap(center, zoom)}>
      <img
        src="https://cdn4.iconfinder.com/data/icons/maps-navigation-24/24/target_destination_current_location_place_focus_recenter-512.png"
        alt="Center Map"
        style={{ width: '30px', height: '30px' }}
      />
    </button>
  );
};

const ResetButton = ({ handleResetPolylines }) => {
  return (
    <button className="reset-button" onClick={handleResetPolylines}>
      <img
        src="https://icons.veryicon.com/png/o/education-technology/learning-to-bully-the-king/reset-14.png"
        alt="Reset Lines"
        style={{ width: '30px', height: '30px' }}
      />
    </button>
  );
};

export  {RecenterButton,ResetButton};
