import React, { useEffect,useState } from 'react'
import { Card, ListGroup,Row,Col, Button } from 'react-bootstrap';
import NoImagePlaceHolder from '../../../images/no-image-placeholder.jpg'
import './ProfileCardComponent.css'
import { Miembro } from '../../../Models';
import { getProyecto } from '../../../services';
interface MiembroCardComponentProps {
    miembro: Miembro
}
export const MiembroCardComponent:React.FC<MiembroCardComponentProps> = ({miembro}) => {
    const [proyectos,setProyectos] = useState<(string|undefined)[]>([]);
    useEffect(() => {
      const fetchProyectos = async() =>{
        if (miembro) {
          const proyectoPromises = miembro.proyectosParticipacion.map((proyecto) => getProyecto(proyecto));
          try {
            const proyectos = await Promise.all(proyectoPromises);
            const nombresCompletos = proyectos.map((proyecto) => proyecto?.tituloProyecto);
            setProyectos(nombresCompletos);
          } catch (error) {
            console.error('Error al obtener los miembros:', error);
          }
        }
      }
      fetchProyectos();

    }, [])
    
    const openDocument = (link: string) =>{
        window.open(link, '_blank');
    }
    return (
        <Card className='profile-card'>
        <Row>
          <Col md={6}>
            <div
              style={{
                minHeight: '50vh',
                minWidth:'25vw',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Card.Img
                src={miembro.fotoPerfil ? miembro.fotoPerfil : NoImagePlaceHolder}
                alt="Profile Image"
                style={{ objectFit: 'cover', maxHeight: '100%', maxWidth: '100%' }}
              />
            </div>
          </Col>
          <Col md={6}>
            <Card.Body>
              <Card.Title>{miembro.nombreCompleto}</Card.Title>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Nombre:</strong> {miembro.nombreCompleto}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Correo Electrónico:</strong> {miembro.correo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Áreas de especialización:</strong>
                  <ul>
                    {miembro.areaEspecializacion.map((estudio, index) => (
                      <li key={index}>{estudio}</li>
                    ))}
                  </ul>
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>Proyectos Participados:</strong>
                  <ul>
                    {proyectos && proyectos.map((proyecto : string | undefined, index : number) => (
                      <li key={index}>
                        {proyecto !== "" && proyecto}
                      </li>
                    ))}
                  </ul>
                </ListGroup.Item>

              </ListGroup>
              <Card.Text>
                <strong>Perfil Académico:</strong>
                <p style={{textIndent:"2rem",padding:"1rem"}}>
                  {miembro.resumen}
                </p>
              </Card.Text>
              {

                miembro.curriculumDocumento && 
                miembro.curriculumDocumento !== "" &&
                <Button 
                    className='curriculum-button'
                    onClick={() => openDocument(miembro.curriculumDocumento)}>
                    Ver Curriculum
                    <i className='bx bxs-file-pdf'></i>
                </Button>
              }
            </Card.Body>
          </Col>
        </Row>
      </Card>
  )
}
