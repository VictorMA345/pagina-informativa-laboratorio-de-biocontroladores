import React from 'react'
import { Enfermedad } from '../../Models'
import { Container,ListGroup,Carousel,Button  } from 'react-bootstrap';
import noImagePlaceHolder from '../../images/no-image-placeholder.jpg'
interface SelectedEnfermedadSectionProps{
    enfermedad : Enfermedad | undefined;
}
import './SelectedSection.css'

import { useTranslation } from 'react-i18next';
export const SelectedEnfermedadSection: React.FC<SelectedEnfermedadSectionProps> = ({enfermedad}) => {
    const formatDate = (date: any) => {
        const options : Object = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    const openDocument = (link: string) =>{
        window.open(link, '_blank');
    }
    const { t } = useTranslation();
  return (
    <Container className = "selected-item-container">
        <ListGroup className="selected-item-listgroup">
            <ListGroup.Item>
                <h5> 
                    {t('cultivos_afectados')}
                </h5>
                <Container className='container-item-list'>
                    {
                        enfermedad?.cultivo.map((cultivo,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { cultivo }
                            </h6>
                        ))
                    }

                </Container>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    {t('publicado_el')}
                </h5>
                <h6>
                    {formatDate(enfermedad?.createdAt)}
                </h6>
            </ListGroup.Item>
        </ListGroup>
        <ListGroup className= 'selected-item-body-listgroup'>
            <ListGroup.Item className='selected-item-body'>
                <h5> 
                    {t('sintomas')}
                </h5>
                <p>
                    {enfermedad?.descripcion}
                </p>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
                <Carousel className='carousel'>
                {
                    enfermedad?.imagenes.length === 0 ? 
                    <Carousel.Item className="carousel-item">
                        <img src={noImagePlaceHolder} />
                    </Carousel.Item>
                    : 
                    enfermedad?.imagenes.map((imagen) =>(
                        <Carousel.Item>
                            <img src={imagen} />
                        </Carousel.Item>

                    ))
                }
                </Carousel>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
                <Container className='document-container'>
                {
                    enfermedad?.documento !== "" ?
                    <Button
                        onClick={() => openDocument(enfermedad ? enfermedad.documento : "")} 
                        className='document-button' 
                        variant= "success">
                        <a>
                            {t('descargar_documento')}
                        </a>
                        <i className='bx bx-download'>
                        </i>
                    </Button>
                    :
                    <h5 style={{fontWeight:"bolder",color:"#909090"}}>
                        No hay Documento Disponible
                    </h5>    
                    }   
                </Container>
            </ListGroup.Item>
        </ListGroup>

    </Container>
  )
}
