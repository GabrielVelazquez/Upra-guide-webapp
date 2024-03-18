import L from 'leaflet';
import waypoint from '../../images/Leaflet_marker_upra.png'; //waypoint de salon
import extintor from '../../images/leaflet_extintor.jpg';
import pull from '../../images/leaflet_pullStation.png';
import meet from '../../images/leaflet_meetingpoint.jpg';

const customMarker = new L.Icon({//waypoint
    iconUrl: waypoint,
    iconSize: [50, 50],
    iconAnchor: [24, 50],
    popupAnchor: [0, -50],
  });
  
  const customExtintor = new L.Icon({//extintor
    iconUrl: extintor,
    iconSize: [30,30],
    //iconAnchor: [24, 24], //originak
    iconAnchor: [0,0], //si es 0,0 siempre es accurate
    popupAnchor: [0, -50],
  });

  const customPullStation = new L.Icon({//pull station de fuego
    iconUrl: pull,
    iconSize: [30,30],
    //iconAnchor: [24, 24],
    iconAnchor: [0,0], //si es 0,0 siempre es accurate
    popupAnchor: [0, -50],
  });

  const customMeetingPoint = new L.Icon({//pull station de fuego
    iconUrl: meet,
    iconSize: [30,30],
    //iconAnchor: [24, 24],
    iconAnchor: [0,0], //si es 0,0 siempre es accurate
    popupAnchor: [0, -50],
  });

  

  export {customMarker, customExtintor, customPullStation, customMeetingPoint};