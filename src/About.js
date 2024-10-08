import React from 'react';
import './About.css';
import Footer from "./footer";
import aboutwolf from "./images/lobo_about.jpeg";

const About = () => {
  return (
    <div className="about">
        <div className="Huge-image-container">
        <div className="Huge-Image"> 
          {/*<img src="https://tintadigital.upra.edu/wp-content/uploads/2020/08/IMG-7740.jpg" alt="UPRA Recinto" />*/}
          {/*<img src="//upra.edu/wp-content/uploads/2022/02/WhatsApp-Image-2022-02-03-at-9.04.10-AM-2.jpeg" alt="UPRA Recinto" /> */}
          <img src={aboutwolf} alt="mascota de la UPRA" />
        </div>
        </div>
        <hr className='hr-about'/>
      <h1>About</h1>
      <p>We are committed to providing accessible and inclusive campus guidance to all students and personnel. Our facilities include ramps, elevators and other accessibility features to ensure that everyone can fully participate in university life.

      </p>
      <h1>Our Purpose</h1>
      <p>Our guide is designed to help guests, students or personnel find information with ease, that being personal information like their email, student number,
       association, etc. or general information about the campus and its services. Our campus map is designed to help you navigate our
       beautiful campus effortlessly with different styles to the users preference and view information about the different locations across the 
       campus. We want to make events easy to find and know their details.</p>
      
 <Footer/>
    </div>
  );
}

export default About;
