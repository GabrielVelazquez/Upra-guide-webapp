//import {React} from "react";
import "./leaflet2.css";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";


const Leaflet2 = () => {
     
    return (
        <div className="mapcont">
            
        <MapContainer  center={[48.8566,2.3522]} zoom={13}> {/*I WANT THE CENTER OF THE IMAGE*/}
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

