import React from 'react';
import './MapComponent.css'; // Importa el archivo CSS

export const MapComponent: React.FC = () => {
  return (
    <div className="map-container">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1962.378836914604!2d-84.51190547101042!3d10.361250837743802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2scr!4v1698032593905!5m2!1ses-419!2scr"
        className="map-iframe"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};
