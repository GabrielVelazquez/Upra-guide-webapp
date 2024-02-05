import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin-home.css';
import { firestore } from './firebase.config';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const Account = () => {
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
    level: '',
    description: '',
    image: '',
    categoria: '', //category si es el segundo proyecto de firestore 
  });
  const categoryOptions =[
   'Select Category',
    'Cafeteria',//'Cafetería',
    'Classrooms',//'Salones',
    'Departments',//'Oficinas de departamentos',
    'Offices',//'Oficina',
    'Parkings',//'Parking',
    'Recreations',//'Recreación',
    'Restrooms',//'Baños',
    'Sports',//'Deportes',
    'Study areas',//'Áreas de estudio',
    'Vending Machines',//'Vending Machine',    
  ]
  const [setExistingCategories] = useState([]);  /* para duplicates */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(firestore, 'location'));
        const categoriesData = categoriesSnapshot.docs.map((doc) => doc.data().categoria);
        const uniqueCategories = [...new Set(categoriesData)];  /*que sean sin repetirse*/
        setExistingCategories(uniqueCategories); /*AQUI para */
      } catch (error) {
        console.error('Error fetching categories from Firestore: ', error);
      }
    };

    fetchCategories();
  }, ); /*[]*/

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAddLocation = async () => {

    if (!formData.name || !formData.lat || !formData.lng || !formData.level || !formData.description) {
      alert('Please fill in all boxes');
      return;
    }

    try {
      const locationCollection = collection(firestore, 'location');
      await addDoc(locationCollection, formData);
      // Reset the form data after successful addition
      setFormData({
        name: '',
        lat: '',
        lng: '',
        level: '',
        description: '',
        image: '',
        categoria: '',
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
            <p className="Account-info-text-course-admin">Categoria:</p>

            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="Account-info-input"
            >
              {categoryOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
            </select>
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
             
            // onChange={handleChange} 
            />
          
          </div>
          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Longitude:</p>
            <input type="text"
             name="lng"
               value={formData.lng}
               onChange={handleChange} 
             className="Account-info-input"
              placeholder="Ex. 139.5577317"
           
              />
          </div>
          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Level:</p>
            <input type="text"
            name="level"
             value={formData.level}
             onChange={handleChange} 
             className="Account-info-input"
              placeholder="Ex. level 1"
               />
          </div>
          <div className="Account-info-row">
            <p className="Account-info-text-course-admin">Description:</p>
            <input type="text"
            name="description" 
             value={formData.description}
             onChange={handleChange} 
            className="Account-info-input"
             placeholder="Ex. parque publico"
            
             />
          </div>
          <p >Imagenes se manejan en el storage de firestore</p>
        {/*<div className="Account-info-row">
          <button className="bubble-top-button-admin" onClick={handleAddLocation}>
            Add Location
          </button>
        </div>
*/}
      </div>
    </div>
 
    </div>
  );
};

export default Account;
