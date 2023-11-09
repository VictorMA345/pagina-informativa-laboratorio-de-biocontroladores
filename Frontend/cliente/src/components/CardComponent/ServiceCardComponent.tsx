import React from 'react';
import { Button, Card, Carousel } from 'react-bootstrap';
import { Servicio } from '../../Models';
import { Link } from 'react-router-dom';
import './ServiceCardComponent.css';
import noImagePlaceholder from '../../images/no-image-placeholder.jpg';
import { useTranslation } from 'react-i18next'
interface ServiceCardComponentProps {
  servicio: Servicio;
  setSelectedItem: React.Dispatch<React.SetStateAction<Servicio | undefined>>;
}

export const ServiceCardComponent: React.FC<ServiceCardComponentProps> = ({ servicio, setSelectedItem }) => {
  const { t } = useTranslation();
  return (
    <Card className="card-component" style={{ width: '18rem', maxHeight: '25rem',minHeight: '25rem' }}>
      {servicio.fotosServicio.length !== 0 ? (
          <Carousel 
            variant="top"
            style={{ maxWidth: '100%', maxHeight: '35vh', minHeight: '35vh', objectFit: 'cover' }}
          >
            {servicio.fotosServicio.map((foto,index) =>(
              <Carousel.Item key={index} 
              style={{ maxWidth: '100%', maxHeight: '35vh', objectFit: 'cover' }}
              >
                <img src={foto}/>
              </Carousel.Item>
            ))}
          </Carousel>
      ) : (
        <Card.Img 
          variant="top"
          src={noImagePlaceholder}
          style={{ maxWidth: '35vh', maxHeight: '35vh', minHeight: '60%'}}
        />
      )}
      <Card.Body>
        <Card.Title>{servicio.nombreServicio}</Card.Title>
      </Card.Body>

      <Card.Body>
        <Link className="service-card-link" to={`/servicios/${servicio._id}`}>
          <Button variant="secondary" onClick={() => setSelectedItem(servicio)} className="service-card-button">
            {t('mas_informacion')} 
            <i className="bx bx-right-arrow-alt service-card-icon"></i>
          </Button>
        </Link>
      </Card.Body>
    </Card>
  );
};
