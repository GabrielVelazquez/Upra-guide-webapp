import React, { useState, useEffect } from "react";
import { firestore } from "./firebase.config";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./View_indoors.css"; 

const ViewIndoors = () => {
    const [indoors, setIndoors] = useState([]);
    const [editedIndoor, setEditedIndoor] = useState(null); // Estado para almacenar el indoor que está siendo editado
    const [originalIndoor, setOriginalIndoor] = useState(null); // Estado para almacenar el indoor original antes de la edición

    useEffect(() => {
        const fetchIndoors = async () => {
            const indoorsCollection = collection(firestore, "interior");
            const indoorsSnapshot = await getDocs(indoorsCollection);
            const indoorsData = indoorsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setIndoors(indoorsData);
        };

        fetchIndoors();
    }, []);

    const handleEditIndoor = (indoorId) => {
        setEditedIndoor(indoorId); // Establecer el indoor que se está editando
        // Guardar el indoor original antes de la edición
        setOriginalIndoor(indoors.find(indoor => indoor.id === indoorId));
    };

    const handleSaveIndoor = async () => {
        try {
            // Actualizar el documento del indoor en la base de datos
            const indoorRef = doc(firestore, "interior", editedIndoor);
            await updateDoc(indoorRef, indoors.find(indoor => indoor.id === editedIndoor));
            setEditedIndoor(null); // Limpiar el estado de indoor editado
        } catch (error) {
            console.error("Error saving indoor:", error);
        }
    };

    const handleCancelEdit = () => {
        // Restaurar el estado del indoor editado al estado original antes de la edición
        setIndoors(indoors.map(indoor => indoor.id === editedIndoor ? originalIndoor : indoor));
        setEditedIndoor(null); // Limpiar el estado de indoor editado
    };

    const handleDeleteIndoor = async (indoorId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this indoor?");
            if (confirmDelete) {
                const indoorRef = doc(firestore, "interior", indoorId);
                await deleteDoc(indoorRef);
                const updatedIndoors = indoors.filter(indoor => indoor.id !== indoorId);
                setIndoors(updatedIndoors);
            }
        } catch (error) {
            console.error("Error deleting indoor:", error);
        }
    };

    return (
        <div className="admin-users-page">
            <h1>Admin View Indoors Page</h1>
            <button className="Edit" to="/Admin_indoors">Add Indoor</button>
            <h2 className="admin-users-header">Indoor Markers List</h2>
            <div className="users-list-container">
                <div>
                    <div className="admin-users-tips">
                        <span>Name</span>
                        <span>Edit</span>
                        <span>Discard Indoor</span>
                    </div>
                    {indoors
                        .sort((a, b) => a.name.localeCompare(b.name)) // Sort indoors alphabetically by name
                        .map((indoor) => (
                            <div className="listdiv" key={indoor.id}>
                                {editedIndoor === indoor.id ? (
                                    <div>
                                        Name:
                                        <input
                                            className="inputs"
                                            type="text"
                                            placeholder="name"
                                            value={indoor.name}
                                            onChange={(e) => {
                                                const updatedIndoors = indoors.map((item) =>
                                                    item.id === indoor.id ? { ...item, name: e.target.value } : item
                                                );
                                                setIndoors(updatedIndoors);
                                            }}
                                        />
                                         Longitude:
                                        <input
                                            className="inputs"
                                            type="text"
                                            value={indoor.lat}
                                            onChange={(e) => {
                                                const updatedIndoors = indoors.map((item) =>
                                                    item.id === indoor.id ? { ...item, lat: e.target.value } : item
                                                );
                                                setIndoors(updatedIndoors);
                                            }}
                                        />
                                        <br />
                                        Latitude:
                                        <input
                                            className="inputs"
                                            type="text"
                                            value={indoor.lng}
                                            onChange={(e) => {
                                                const updatedIndoors = indoors.map((item) =>
                                                    item.id === indoor.id ? { ...item, lng: e.target.value } : item
                                                );
                                                setIndoors(updatedIndoors);
                                            }}
                                        />
                                        <div className="save-container">
                                        <button className="Save" onClick={handleSaveIndoor}>Save</button>
                                        <button className="Cancel" onClick={handleCancelEdit}>Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {indoor.name}
                                        <button className="Edit" onClick={() => handleEditIndoor(indoor.id)}>
                                            Edit Indoor
                                        </button>
                                        <button className="Discard" onClick={() => handleDeleteIndoor(indoor.id)}>Delete Indoor</button>
                                    </>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ViewIndoors;


