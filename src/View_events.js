import React, { useState, useEffect } from "react";
import { firestore } from "./firebase.config";
import { collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./View_indoors.css"; 

const ViewEvents = () => {
    const [Events, setEvents] = useState([]);
    const [editedevent, setEditedevent] = useState(null); // Estado para almacenar el event que está siendo editado
    const [originalevent, setOriginalevent] = useState(null); // Estado para almacenar el event original antes de la edición
    useEffect(() => {
        const fetchEvents = async () => {
            const EventsCollection = collection(firestore, "Event");
            const EventsSnapshot = await getDocs(EventsCollection);
            const EventsData = EventsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEvents(EventsData);
        };

        fetchEvents();
    }, []);

    const handleEditevent = (eventId) => {
        setEditedevent(eventId); // Establecer el event que se está editando
        // Guardar el event original antes de la edición
        setOriginalevent(Events.find(event => event.id === eventId));
    };

    const handleSaveevent = async () => {
        try {
            // Actualizar el documento del event en la base de datos
            const eventRef = doc(firestore, "Event", editedevent);
            await updateDoc(eventRef, Events.find(event => event.id === editedevent));
            setEditedevent(null); // Limpiar el estado de event editado
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    const handleCancelEdit = () => {
        // Restaurar el estado del event editado al estado original antes de la edición
        setEvents(Events.map(event => event.id === editedevent ? originalevent : event));
        setEditedevent(null); // Limpiar el estado de event editado
    };

    const handleDeleteevent = async (eventId) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this event?");
            if (confirmDelete) {
                const eventRef = doc(firestore, "Event", eventId);
                await deleteDoc(eventRef);
                const updatedEvents = Events.filter(event => event.id !== eventId);
                setEvents(updatedEvents);
            }
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };
    const handleImageChange = (e, eventId) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageDataUrl = reader.result;
            const updatedEvents = Events.map((event) => {
                if (event.id === eventId) {
                    return { ...event, image: imageDataUrl };
                }
                return event;
            });
            setEvents(updatedEvents);
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="admin-users-page">
            <h1>Admin View Events Page</h1>
            <Link to="/AdminEvents">
            <button className="Edit-add">➕ Add Event</button>
            </Link>
            <h2 className="admin-users-header">Events List</h2>
            <div className="users-list-container">
                <div>
                    <div className="admin-users-tips">
                        <span>Name</span>
                        <span>Edit</span>
                        <span>Discard event</span>
                    </div>
                    {Events.sort((a, b) => a.name.localeCompare(b.name)).map((event) => (
                        <div className="listdiv" key={event.id}>
                            {editedevent === event.id ? (
                                <div>
                                    <input
                                        className="inputs"
                                        type="text"
                                        placeholder="name"
                                        value={event.name}
                                        onChange={(e) => {
                                            const updatedEvents = Events.map((item) =>
                                                item.id === event.id ? { ...item, name: e.target.value } : item
                                            );
                                            setEvents(updatedEvents);
                                        }}
                                    />
                                    <input
                                        className="inputs"
                                        type="text"
                                        value={event.date}
                                        onChange={(e) => {
                                            const updatedEvents = Events.map((item) =>
                                                item.id === event.id ? { ...item, date: e.target.value } : item
                                            );
                                            setEvents(updatedEvents);
                                        }}
                                    />
                                    <br />
                                    <input
                                        className="inputs"
                                        type="text"
                                        value={event.time}
                                        onChange={(e) => {
                                            const updatedEvents = Events.map((item) =>
                                                item.id === event.id ? { ...item, level: e.target.value } : item
                                            );
                                            setEvents(updatedEvents);
                                        }}
                                    />
                                    <br />
                                    <input
                                        className="inputs"
                                        type="text"
                                        value={event.location}
                                        onChange={(e) => {
                                            const updatedEvents = Events.map((item) =>
                                                item.id === event.id ? { ...item, location: e.target.value } : item
                                            );
                                            setEvents(updatedEvents);
                                        }}
                                    />
                                    <br />
                                    <input
                                        className="inputs"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e, event.id)}
                                    />
                                    <img src={event.imageUrl} alt="event" style={{ width: "250px", height: "250px" }} />
                                    <br />
                                   
                                    <button onClick={handleSaveevent}>Save</button>
                                    <button onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    {event.name}
                                    <button className="Edit" onClick={() => handleEditevent(event.id)}>Edit event</button>
                                    <button className="Discard" onClick={() => handleDeleteevent(event.id)}>Delete event</button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewEvents;
