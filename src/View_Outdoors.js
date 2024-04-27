import React, { useState, useEffect } from "react";
import { firestore } from "./firebase.config";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./View_indoors.css"; 

const ViewOutdoors = () => {
    const [Outdoors, setOutdoors] = useState([]);
    const [editedoutdoor, setEditedoutdoor] = useState(null); // Estado para almacenar el outdoor que está siendo editado
    const [originaloutdoor, setOriginaloutdoor] = useState(null); // Estado para almacenar el outdoor original antes de la edición
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
    useEffect(() => {
        const fetchOutdoors = async () => {
            const OutdoorsCollection = collection(firestore, "location");
            const OutdoorsSnapshot = await getDocs(OutdoorsCollection);
            const OutdoorsData = OutdoorsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOutdoors(OutdoorsData);
        };

        fetchOutdoors();
    }, []);

    const handleEditoutdoor = (outdoorId) => {
        setEditedoutdoor(outdoorId); // Establecer el outdoor que se está editando
        // Guardar el outdoor original antes de la edición
        setOriginaloutdoor(Outdoors.find(outdoor => outdoor.id === outdoorId));
    };

    const handleSaveoutdoor = async () => {
        try {
            // Actualizar el documento del outdoor en la base de datos
            const outdoorRef = doc(firestore, "location", editedoutdoor);
            await updateDoc(outdoorRef, Outdoors.find(outdoor => outdoor.id === editedoutdoor));
            setEditedoutdoor(null); // Limpiar el estado de outdoor editado
        } catch (error) {
            console.error("Error saving outdoor:", error);
        }
    };

    const handleCancelEdit = () => {
        // Restaurar el estado del outdoor editado al estado original antes de la edición
        setOutdoors(Outdoors.map(outdoor => outdoor.id === editedoutdoor ? originaloutdoor : outdoor));
        setEditedoutdoor(null); // Limpiar el estado de outdoor editado
    };

    const handleDeleteoutdoor = async (outdoorId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this outdoor?");
            if (confirmDelete) {
                const outdoorRef = doc(firestore, "location", outdoorId);
                await deleteDoc(outdoorRef);
                const updatedOutdoors = Outdoors.filter(outdoor => outdoor.id !== outdoorId);
                setOutdoors(updatedOutdoors);
            }
        } catch (error) {
            console.error("Error deleting outdoor:", error);
        }
    };
    const handleImageChange = (e, outdoorId) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageDataUrl = reader.result;
            const updatedOutdoors = Outdoors.map((outdoor) => {
                if (outdoor.id === outdoorId) {
                    return { ...outdoor, image: imageDataUrl };
                }
                return outdoor;
            });
            setOutdoors(updatedOutdoors);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="admin-users-page">
            <h1>Admin View Outdoors Page</h1>

            <Link  to="/Admin-outdoors">
            <button className="Edit-add">➕ Add Outdoor marker</button>
            </Link>

            <h2 className="admin-users-header">Outdoors Markers List</h2>
            <div className="users-list-container">
                <div>
                    <div className="admin-users-tips">
                        <span>Name</span>
                        <span>Edit info</span>
                        <span>Discard marker</span>
                    </div>
                    {Outdoors.sort((a, b) => a.name.localeCompare(b.name)).map((outdoor) => (
                        <div className="listdiv" key={outdoor.id}>
                            {editedoutdoor === outdoor.id ? (
                                <div>
                                    Name:
                                    <input
                                        className="inputs"
                                        type="text"
                                        placeholder="name"
                                        value={outdoor.name}
                                        onChange={(e) => {
                                            const updatedOutdoors = Outdoors.map((item) =>
                                                item.id === outdoor.id ? { ...item, name: e.target.value } : item
                                            );
                                            setOutdoors(updatedOutdoors);
                                        }}
                                    />
                                    Longitude:
                                    <input
                                        className="inputs"
                                        type="text"
                                        value={outdoor.lat}
                                        onChange={(e) => {
                                            const updatedOutdoors = Outdoors.map((item) =>
                                                item.id === outdoor.id ? { ...item, lat: e.target.value } : item
                                            );
                                            setOutdoors(updatedOutdoors);
                                        }}
                                    />
                                    <br />
                                    Latitude:
                                    <input
                                        className="inputs"
                                        type="text"
                                        value={outdoor.lng}
                                        onChange={(e) => {
                                            const updatedOutdoors = Outdoors.map((item) =>
                                                item.id === outdoor.id ? { ...item, lng: e.target.value } : item
                                            );
                                            setOutdoors(updatedOutdoors);
                                        }}
                                    />
                                    <br />
                                    Category:
                                    <select
                                        className="cat-inputs"
                                        value={outdoor.categoria}
                                        onChange={(e) => {
                                            const updatedOutdoors = Outdoors.map((item) =>
                                                item.id === outdoor.id ? { ...item, categoria: e.target.value } : item
                                            );
                                            setOutdoors(updatedOutdoors);
                                        }}
                                    >
                                        {categoryOptions.map((category, index) => (
                                            <option key={index} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    <br />
                                    Description:
                                    <textarea
                                        className="text-area-style"
                                        type="text"
                                        value={outdoor.description}
                                        onChange={(e) => {
                                            const updatedOutdoors = Outdoors.map((item) =>
                                                item.id === outdoor.id ? { ...item, description: e.target.value } : item
                                            );
                                            setOutdoors(updatedOutdoors);
                                        }}
                                    />
                                    <br />
                                    Image:
                                    <input
                                        className="inputs"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, outdoor.id)}
                                    />
                                    {outdoor.image ? (
                                        <img src={outdoor.image} alt="Outdoor" style={{ width: "250px", height: "250px" }} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                    <br />
                                    Level:
                                    <input
                                        className="inputs"
                                        type="text"
                                        value={outdoor.level}
                                        onChange={(e) => {
                                            const updatedOutdoors = Outdoors.map((item) =>
                                                item.id === outdoor.id ? { ...item, level: e.target.value } : item
                                            );
                                            setOutdoors(updatedOutdoors);
                                        }}
                                    />
                                    <br />
                                    <button className="Save" onClick={handleSaveoutdoor}>Save</button>
                                    <button className="Cancel" onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    {outdoor.name}
                                    <button className="Edit" onClick={() => handleEditoutdoor(outdoor.id)}>Edit outdoor</button>
                                    <button className="Discard" onClick={() => handleDeleteoutdoor(outdoor.id)}>Delete outdoor</button>
                               
                                </>
                            )}
                        </div>  
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewOutdoors;
