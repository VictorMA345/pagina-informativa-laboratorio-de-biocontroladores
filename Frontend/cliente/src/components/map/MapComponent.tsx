import React from 'react';
import './MapComponent.css'; // Importa el archivo CSS

export const MapComponent: React.FC = () => {
  return (
    <div className="map-container">
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245.2972576527301!2d-84.5134253697889!3d10.36137470792877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa06e7045f05d91%3A0xc7ab25d6863d0b0c!2sLaboratorio%20De%20Fitopatolog%C3%ADa%20Y%20Biocontroladores!5e0!3m2!1ses-419!2scr!4v1698385549037!5m2!1ses-419!2scr" 
      width="600" 
      height="450" style={{border:"0"}}
      loading="lazy"
      className="map-iframe"
      referrerPolicy="no-referrer-when-downgrade"
      >
        
      </iframe>
    </div>
  );
};
