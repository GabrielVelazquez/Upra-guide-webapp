import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './admin-home.css';
import { firestore, storage } from './firebase.config';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes,getDownloadURL } from 'firebase/storage'; // Importa las funciones necesarias para cargar archivos

const AdminEvents = () => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const handleAddLocation = async () => {
    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const eventCollection = collection(firestore, 'Event');
      
      if (formData.image) {
        const imageRef = ref(storage, `Events/${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        const imageUrl = await getDownloadURL(imageRef);
        setFormData((prevData) => ({ ...prevData, image: imageUrl }));
      }

      const newEvent = {
        date: formData.date,
        imageUrl: formData.image,
        name: formData.name,
        time: formData.time,
        location: formData.location,
      };

      await addDoc(eventCollection, newEvent);

      setFormData({
        name: '',
        date: '',
        time: '',
        location: '',
        image: '',
      });

      alert('Event added successfully');
      
    } catch (error) {
      console.error('Error adding event to Firestore: ', error);
      alert('Failed to add event. Please try again.');
    }
  };

  return (
    <div className="Account-full-admin">
      <div className="bubble-AddLocation-admin">
        <Link className="bubble-top-button-admin" onClick={handleAddLocation}>
          Add
        </Link>
        <div className="bubble-top-admin">
          <div className="bubble-top-text-admin">Add Event</div>
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
              placeholder="Event name"
            />
          </div>
         
          <div className="Account-info-row">
  <p className="Account-info-text-course-admin">Date:</p>
  <input
    type="text"
    name="date"
    value={formData.date}
    onChange={handleChange}
    className="Account-info-input"
    placeholder="Event date"
  />
</div>

<div className="Account-info-row">
  <p className="Account-info-text-course-admin">Location:</p>
  <input
    type="text"
    name="location"
    value={formData.location}
    onChange={handleChange}
    className="Account-info-input"
    placeholder="Event location"
  />
</div>
<div className="Account-info-row">
  <p className="Account-info-text-course-admin">Time:</p>
  <input
    type="text"
    name="time"
    value={formData.time}
    onChange={handleChange}
    className="Account-info-input"
    placeholder="Event time"
  />
</div>


          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Image:</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="Account-info-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvents;