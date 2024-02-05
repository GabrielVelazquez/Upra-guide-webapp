import React, { useState, useEffect } from 'react';
import './Banner.css'; // Archivo para estilos CSS del banner
import banner_img from "./images/banner-CSSA.PNG";

const Banner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Mostrar el banner
    setIsVisible(true);

    // Ocultar el banner después de 5 segundos (5000 milisegundos)
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    // Limpiar el temporizador para evitar fugas de memoria
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`banner ${isVisible ? 'show' : 'hide'}`}>
      <a target='blank' href="https://linktr.ee/cssa.upra">
        
          <img
          alt='banner'
            src={banner_img }
          />
        </a>
    </div>
  );
};

export default Banner;
