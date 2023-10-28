
import React,{useState,useEffect} from 'react'
import { Proyecto } from '../../Models'
import { Container,ListGroup,Carousel,Button  } from 'react-bootstrap';
import { getMiembro } from '../../services';
import noImagePlaceHolder from '../../images/no-image-placeholder.jpg'
interface SelectedProyectoSectionProps{
    proyecto : Proyecto | undefined;
}
import './SelectedSection.css'
export const SelectedProyectoSection: React.FC<SelectedProyectoSectionProps> = ({proyecto}) => {
    const formatDate = (date: any) => {
        const options : Object = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    const [miembrosList,setMiembrosList] = useState<string[]>([]);
    const openDocument = (link: string) =>{
        window.open(link, '_blank');
    }
    useEffect(() => {
        const fetchMiembros = async () => {
          if (proyecto) {
            const encargadoPromises = proyecto.investigadores.map((investigador) => getMiembro(investigador));
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
      }, [proyecto]);
  return (
    <Container className = "selected-item-container">
        <ListGroup className="selected-item-listgroup">
            <ListGroup.Item>
                <h5> 
                    Investigadores del Proyecto:
                </h5>
                <Container className='container-item-list'>
                    {
                        miembrosList.map((investigador,index) =>(
                            investigador !== "" &&
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { investigador }
                            </h6>
                        ))
                    }

                </Container>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    Fecha de Inicio:
                </h5>
                <h6>
                    {formatDate(proyecto?.fechaInicio)}
                </h6>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    Fecha de Finalización:
                </h5>
                <h6>
                    {proyecto?.fechaInicio && formatDate(proyecto.fechaInicio)}
                </h6>
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    Areas de la investigación:
                </h5>
                    {
                        proyecto?.areasInvestigacion.map((area,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { area }
                            </h6>
                        ))
                    }
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    Palabras Clave:
                </h5>
                    {
                        proyecto?.palabrasClave.map((palabra,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { palabra }
                            </h6>
                        ))
                    }
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    Financiamiento del Proyecto:
                </h5>
                    {
                        proyecto?.financiamiento
                    }
            </ListGroup.Item>
            <ListGroup.Item>
                <h5> 
                    Año del Proyecto:
                </h5>
                    {
                        proyecto?.anioProyecto
                    }
            </ListGroup.Item>
        </ListGroup>
        <ListGroup className= 'selected-item-body-listgroup'>
            <ListGroup.Item className='selected-item-body'>
                <h4> 
                    Resumen del Proyecto: 
                </h4>
                <p>
                    {proyecto?.resumenProyecto}
                </p>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
                <Carousel className='carousel'>
                {
                    proyecto?.imagenes.length === 0 ? 
                    <Carousel.Item className="carousel-item">
                        <img src={noImagePlaceHolder} />
                    </Carousel.Item>
                    : 
                    proyecto?.imagenes.map((imagen) =>(
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
                    proyecto?.documentos !== "" ?
                    <Button
                        onClick={() => openDocument(proyecto ? proyecto.documentos : "")} 
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
            <ListGroup.Item className='selected-item-body'>
                <h3> 
                    Bibliografía:
                </h3>
                <br>
                </br>
                {proyecto?.referencias.map((cita,index) => (
                    <h6 key = {index}>
                        - { cita }
                    </h6>
                ))}
            </ListGroup.Item>
        </ListGroup>

    </Container>
  )
}
