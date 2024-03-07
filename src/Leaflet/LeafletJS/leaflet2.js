//import {React} from "react";
/*import "./leaflet2.css";*/
import "../LeafletCSS/leaflet2.css";
import "leaflet/dist/leaflet.css";

import { MapContainer, TileLayer } from "react-leaflet";


const Leaflet2 = () => {
     
    return (
        <div className="mapcont">
            
        <MapContainer  center={[18.46899726783513, -66.7414733800247]} zoom={19}> {/*I WANT THE CENTER OF THE IMAGE*/}
        {/*<h1 className="title-indoor">learning common</h1>*/}
        <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        </MapContainer>
        </div>
    );
};
export default Leaflet2; 

