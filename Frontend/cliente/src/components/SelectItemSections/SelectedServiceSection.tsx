import React from 'react'
import { Servicio } from '../../Models'
import { Container,ListGroup,Carousel  } from 'react-bootstrap';
import noImagePlaceHolder from '../../images/no-image-placeholder.jpg'
import './SelectedSection.css'
interface SelectedServiceSectionProps {
    selecteditem : Servicio | undefined;
}
import { useTranslation } from 'react-i18next'
export const SelectedServiceSection: React.FC<SelectedServiceSectionProps> = ({selecteditem}) => {
    const { t } = useTranslation();
    return (
    <Container className = "selected-item-container">
        <ListGroup className="selected-item-listgroup">
            <ListGroup.Item>
                <h5> 
                    {t('tipo_servicio')}:
                </h5>
                <h6>
                    {selecteditem?.tipoServicio}
                </h6>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    {t('telefono')}:
                </h5>
                <h6>
                    {selecteditem?.telefono}
                </h6>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    {t('correo')}:
                </h5>
                <h6>
                    {selecteditem?.correoElectronico}
                </h6>
            </ListGroup.Item>
        </ListGroup>
        <ListGroup className= 'selected-item-body-listgroup'>
            <ListGroup.Item className='selected-item-body'>
                <h5> 
                    {t('descripcion_servicio')}:
                </h5>
                <p>
                    {selecteditem?.descripcion}
                </p>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
            <Carousel className='carousel'>

                {
                    selecteditem?.fotosServicio.length === 0 ? 
                    <Carousel.Item className="carousel-item">
                        <img src={noImagePlaceHolder} />
                    </Carousel.Item>
                    : 
                    selecteditem?.fotosServicio.map((imagen) =>(
                        <Carousel.Item>
                            <img src={imagen} />
                        </Carousel.Item>

                    ))
                }
                </Carousel>
            </ListGroup.Item>
        </ListGroup>
    </Container>
  )
}
