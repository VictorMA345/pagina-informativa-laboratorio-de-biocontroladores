import React from 'react'
import { Noticia } from '../../Models'
import { Container,ListGroup,Carousel,Button  } from 'react-bootstrap';
import noImagePlaceHolder from '../../images/no-image-placeholder.jpg'
interface SelectedNoticiaSectionProps{
    noticia : Noticia | undefined;
}
import { useTranslation } from 'react-i18next'
import './SelectedSection.css'
export const SelectedNoticiaSection: React.FC<SelectedNoticiaSectionProps> = ({noticia}) => {
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
                    {t('publicador')}:
                </h5>
                <Container className='container-item-list'>
                    {noticia?.publicador}
                </Container>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    {t('fechaPublicacion')}:
                </h5>
                <h6>
                    {formatDate(noticia?.fechaPublicacion)}
                </h6>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    {t('categoria')}:
                </h5>
                <h6>
                    {noticia?.categoria}
                </h6>
            </ListGroup.Item>
        </ListGroup>
        <ListGroup className= 'selected-item-body-listgroup'>
            <ListGroup.Item className='selected-item-body'>
                <h4> 
                    {noticia?.titulo}:
                </h4>
                <p>
                    {noticia?.textoCompleto}
                </p>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
                <Carousel className='carousel'>
                {
                    noticia?.imagenes.length === 0 ? 
                    <Carousel.Item className="carousel-item">
                        <img src={noImagePlaceHolder} />
                    </Carousel.Item>
                    : 
                    noticia?.imagenes.map((imagen) =>(
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
                    noticia?.documentoComplementario !== "" ?
                    <Button
                        onClick={() => openDocument(noticia ? noticia.documentoComplementario : "")} 
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
                        {t('no_hay_documento')}
                    </h5>    
                    }   
                </Container>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
                <h3> 
                    {t('fuente')}:
                </h3>
                <br>
                </br>
                {noticia?.citasBibliograficas.map((cita,index) => (
                    <h6 key = {index}>
                        - { cita }
                    </h6>
                ))}
            </ListGroup.Item>
        </ListGroup>

    </Container>
  )
}

