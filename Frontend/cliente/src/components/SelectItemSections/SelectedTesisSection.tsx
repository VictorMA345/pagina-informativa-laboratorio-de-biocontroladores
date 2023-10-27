import React,{useState,useEffect} from 'react';
import { Tesis,Estudiante } from '../../Models';
import { Container,Image,ListGroup,Carousel,Button} from 'react-bootstrap';
import noImagePlaceHolder from '../../images/no-image-placeholder.jpg'
import { getEstudiante } from '../../services';
import "./SelectedSection.css"
interface SelectedTesisSectionProps {
  selectedTesis: Tesis | undefined;
}

export const SelectedTesisSection: React.FC<SelectedTesisSectionProps> = ({ selectedTesis }) => {
    const formatDate = (date: any) => {
        const options : Object = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
    const openDocument = (link: string) =>{
        window.open(link, '_blank');
    }
    const [estudiantesList,setestudiantesList] = useState<string[]>([]);
    useEffect(() => {
        const fetchEstudiantes = async () => {
          if (selectedTesis) {
            const estudiantePromises = selectedTesis.estudiantesParticipantes.map((estudiante) => getEstudiante(estudiante));
            try {
              const estudiantes = await Promise.all(estudiantePromises);
              const nombresCompletos = estudiantes.map((estudiante: Estudiante) => estudiante.nombreCompleto);
              setestudiantesList(nombresCompletos);
            } catch (error) {
              console.error('Error al obtener los miembros:', error);
            }
          }
        };
        fetchEstudiantes();
      }, [selectedTesis]);
  return (
    <>
    
    <Container className= 'selected-header-container'>
        <Container className='selected-item-image-container'>
            <Image
            src={selectedTesis?.pathFotoTitulo}
            style={{maxHeight:"70vh",maxWidth:"100vw",border: "2px solid #C0C0C0"}}
            >

            </Image>
        </Container>
        <Container className='text-information-container'>
            <ListGroup  className="selected-item-listgroup">
                <ListGroup.Item>
                    <h6>
                        Estado de la tesis: 
                    </h6>
                    <p>
                        {selectedTesis?.estadoTesis}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Fecha de inicio: 
                    </h6>
                    <p>
                        {formatDate(selectedTesis?.fechaInicio)}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Fecha de finalización: 
                    </h6>
                    <p>
                        {selectedTesis?.fechaFinalizacion ? formatDate(selectedTesis?.fechaFinalizacion) : "La tesis se encuentra en ejecución"}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Empresas Involucradas: 
                    </h6>
                    <Container className='container-item-list'>
                    {
                        selectedTesis?.empresasParticipantes.map((empresa,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { empresa }
                            </h6>
                        ))
                    }
                    </Container>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Estudiantes estudiantes: 
                    </h6>
                    <Container className='container-item-list'>
                    {
                        estudiantesList.map((estudiante,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { estudiante }
                            </h6>
                        ))
                    }
                    </Container>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Financiamiento: 
                    </h6>
                    <p>
                        {selectedTesis?.financiamiento}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Palabras Clave: 
                    </h6>
                    <Container className='container-item-list'>
                    {
                        selectedTesis?.palabrasClave.map((palabra,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { palabra }
                            </h6>
                        ))
                    }
                    </Container>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Comité evaluador de la tesis: 
                    </h6>
                    <p>
                        {selectedTesis?.nombreComite}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        estudiantes del comité evaluador: 
                    </h6>
                    <Container className='container-item-list'>
                    {
                        selectedTesis?.miembrosComite.map((miembro,index) =>(
                            <h6 
                                className='item-list'
                                key = {index}
                            >
                            { miembro }
                            </h6>
                        ))
                    }
                    </Container>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                        Grado Obtenido:
                    </h6>
                    <p>
                        {selectedTesis?.gradoObtenido}
                    </p>
                </ListGroup.Item>
                <ListGroup.Item>
                    <h6>
                       Año:
                    </h6>
                    <p>
                        {selectedTesis?.anioTesis}
                    </p>
                </ListGroup.Item>
            </ListGroup>
        </Container>
    </Container>
    <Container className = "selected-item-container">

    <ListGroup className= 'selected-item-body-listgroup'>
            <ListGroup.Item className='selected-item-body'>
                <h3> 
                    Resumen:
                </h3>
                <p>
                    {selectedTesis?.resumenTesis}
                </p>
            </ListGroup.Item>

            <ListGroup.Item className='selected-item-body'>
                <h3> 
                    Abstract:
                </h3>
                <p>
                    {selectedTesis?.resumenTesis}
                </p>
            </ListGroup.Item>
            <ListGroup.Item className='selected-item-body'>
            <Carousel className='carousel'>

                {
                    selectedTesis?.imagenesExtras.length === 0 ? 
                    <Carousel.Item className="carousel-item">
                        <img src={noImagePlaceHolder} />
                    </Carousel.Item>
                    : 
                    selectedTesis?.imagenesExtras.map((imagen) =>(
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
                    selectedTesis?.pathArchivo !== "" ?
                    <Button
                        onClick={() => openDocument(selectedTesis ? selectedTesis.pathArchivo : "")} 
                        className='document-button' 
                        variant= "success">
                        <a>
                            Descargar Tesis
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
                {selectedTesis?.citasReferencias.map((cita,index) => (
                    <h6 key = {index}>
                        - { cita }
                    </h6>
                ))}
            </ListGroup.Item>
        </ListGroup>
    </Container>
    </>
  );
};
