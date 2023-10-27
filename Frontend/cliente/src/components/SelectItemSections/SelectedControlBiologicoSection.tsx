import React, { useEffect,useState } from 'react'
import { ControlBiologico } from '../../Models'
import { Container,ListGroup,Carousel,Button  } from 'react-bootstrap';
import { getMiembro } from '../../services';
import noImagePlaceHolder from '../../images/no-image-placeholder.jpg'
interface SelectedControlBiologicoSectionProps{
    controlbiologico : ControlBiologico | undefined;
}
import './SelectedSection.css'
export const SelectedControlBiologicoSection: React.FC<SelectedControlBiologicoSectionProps> = ({controlbiologico}) => {
    const [miembrosList,setMiembrosList] = useState<string[]>([]);
    const formatDate = (date: any) => {
        const options : Object = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    const openDocument = (link: string) =>{
        window.open(link, '_blank');
    }
    useEffect(() => {
        const fetchMiembros = async () => {
          if (controlbiologico) {
            const encargadoPromises = controlbiologico.encargados.map((encargado) => getMiembro(encargado));
            try {
              const miembros = await Promise.all(encargadoPromises);
              const nombresCompletos = miembros.map((miembro) => miembro.nombreCompleto);
              setMiembrosList(nombresCompletos);
            } catch (error) {
              console.error('Error al obtener los miembros:', error);
            }
          }
        };
        fetchMiembros();
      }, [controlbiologico]);
  return (
    <Container className = "selected-item-container">
        <ListGroup className="selected-item-listgroup">
            <ListGroup.Item>
                <h5> 
                    Encargados de la investigación:
                </h5>
                <Container className='container-item-list'>
                    {
                        miembrosList.map((encargado,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { encargado }
                            </h6>
                        ))
                    }

                </Container>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    Publicado el:
                </h5>
                <h6>
                    {formatDate(controlbiologico?.fechaPublicacion)}
                </h6>
            </ListGroup.Item>
        </ListGroup>
        <ListGroup className= 'selected-item-body-listgroup'>
            <ListGroup.Item className='selected-item-body'>
                <h5> 
                    Investigación: 
                </h5>
                <p>
                    {controlbiologico?.textoExplicativo}
                </p>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
                <Carousel className='carousel'>
                {
                    controlbiologico?.imagenes.length === 0 ? 
                    <Carousel.Item className="carousel-item">
                        <img src={noImagePlaceHolder} />
                    </Carousel.Item>
                    : 
                    controlbiologico?.imagenes.map((imagen,index) =>(
                        <Carousel.Item key= {index}>
                            <img src={imagen} />
                        </Carousel.Item>

                    ))
                }
                </Carousel>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
                <Container className='document-container'>
                    {
                    controlbiologico?.documentoDetallado !== "" ?
                    <Button
                        onClick={() => openDocument(controlbiologico ? controlbiologico.documentoDetallado : "")} 
                        className='document-button' 
                        variant= "success">
                        <a>
                            Descargar Documento
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
