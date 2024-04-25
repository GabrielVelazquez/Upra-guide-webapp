import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from './firebase.config';
import './admin-home.css';

const AdminIndoors = () => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };



  const handleAddLocation = async () => {
    if (!formData.name || !formData.lat || !formData.lng){ //|| !formData.level || !formData.description || !formData.leafletFile) {
      alert('Please fill in all fields.'); // and select a Leaflet file.');
      return;
    }
  
    try {
      const locationCollection = collection(firestore, 'interior');
  
      await addDoc(locationCollection, { 
        name: formData.name,
        lat: formData.lat,
        lng: formData.lng,
      
      });
      setFormData({
        name: '',
        lat: '',
        lng: '',
      });
      
      alert('Location added');
    } catch (error) {
      console.error('Error adding location to Firestore: ', error);
      alert('Failed to add location. Please try again.');
    }
  };
  

  return (
    <div className="Account-full-admin">
      <div className="bubble-AddLocation-admin">
        <Link className="bubble-top-button-admin" onClick={handleAddLocation}>
          Add
        </Link>
        <div className="bubble-top-admin">
          <div className="bubble-top-text-admin">Add Location</div>
        </div>

        <div className="Account-info-container">
          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Name:</p>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="Account-info-input"
              placeholder="Ex. park"
            />
          </div>

          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Latitude:</p>
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              className="Account-info-input"
              placeholder="Ex. 35.7040744"
            />
          </div>

          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Longitude:</p>
            <input
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              className="Account-info-input"
              placeholder="Ex. 139.5577317"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIndoors;
