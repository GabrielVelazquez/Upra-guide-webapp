import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Events.css';
import { firestore } from './firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import Footer from "./footer";


const Events = () => {
  const [eventsData, setEventsData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsCollection = collection(firestore, 'Event');
        const snapshot = await getDocs(eventsCollection);

        const eventsArray = snapshot.docs.map((doc) => {
          const eventData = doc.data();
          const imagen = eventData.imageUrl;

          return {
            id: doc.id,
            imageUrl: imagen,
            ...eventData,
          };
        });

        setEventsData(eventsArray);
      } catch (error) {
        console.error('Error fetching events: ', error);
      }
    };

    fetchData();
  }, [firestore]); /* warning de vsc arruina esto*/


  return (
    <div>
    <div className="events-container">
      <div className="back-header">
        <Link to="/">
          <button className="back-button">&#8592;</button>
        </Link>
      </div>

      <h1 className="events-title">Events</h1>

      <hr className="hr-events" />

      {eventsData.map((event, index) => (
        <div className="event" key={index}>
          <div className="event-image">
            <img src={event.imageUrl} alt={`Event ${index + 1}`} />
          </div>
          <div className="event-details">
            <div className="event-date">{event.date}</div>
            <div className="event-info">
              <p className="event-name">{event.name}</p>
              <p className="event-location">{event.location}</p>
              <p className="event-time">{event.time}</p>
            </div>
          </div>
        </div>
        
      ))}
                
    </div>
    <Footer/>
    </div>
  );
};

export default Events;