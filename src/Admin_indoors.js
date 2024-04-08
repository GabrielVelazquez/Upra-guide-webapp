import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { firestore, storage } from './firebase.config';
import './admin-home.css';

const AdminIndoors = () => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    level: '',
    description: '',
    leafletFile: null,
    categoria: '', 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLeafletFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, leafletFile: file }));
  };

  const handleAddLocation = async () => {
    if (!formData.name || !formData.lat || !formData.lng || !formData.level || !formData.description || !formData.leafletFile) {
      alert('Please fill in all fields and select a Leaflet file.');
      return;
    }
  
    try {
      const locationCollection = collection(firestore, 'interior');
      const leafletRef = ref(storage, `leafletJS/${formData.leafletFile.name}`);
      
      await uploadBytes(leafletRef, formData.leafletFile);
      const leafletUrl = await getDownloadURL(leafletRef);
  
      await addDoc(locationCollection, { 
        name: formData.name,
        lat: formData.lat,
        lng: formData.lng,
        level: formData.level,
        description: formData.description,
        leafletUrl: leafletUrl, // Aquí se guarda la URL de descarga en lugar del objeto File
        categoria: formData.categoria
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

          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Level:</p>
            <input
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="Account-info-input"
              placeholder="Ex. level 1"
            />
          </div>

          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Description:</p>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="Account-info-input"
              placeholder="Ex. public park"
            />
          </div>

          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Leaflet File:</p>
            <input
              type="file"
              accept=".js"
              onChange={handleLeafletFileChange}
              className="Account-info-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminIndoors;
