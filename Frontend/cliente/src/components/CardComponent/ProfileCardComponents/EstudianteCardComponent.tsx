import React from 'react'
import { Card, ListGroup,Row,Col, Button } from 'react-bootstrap';
import NoImagePlaceHolder from '../../../images/no-image-placeholder.jpg'
import { Estudiante } from '../../../Models';
import './ProfileCardComponent.css'
interface EstudianteCardComponentProps {
    estudiante: Estudiante
}
export const EstudianteCardComponent:React.FC<EstudianteCardComponentProps> = ({estudiante}) => {
    const openDocument = (link: string) =>{
        window.open(link, '_blank');
    }
    return (
        <Card className='profile-card'> 
        <Row>
          <Col md={6}>
            <div
              style={{

                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card.Img
                src={estudiante.fotoPerfil ? estudiante.fotoPerfil : NoImagePlaceHolder}
                alt="Profile Image"
                style={{ objectFit: 'cover', maxHeight: '100%', maxWidth: '100%' }}
              />
            </div>
          </Col>
          <Col md={6}>
            <Card.Body>
              <Card.Title>{estudiante.nombreCompleto}</Card.Title>
              <ListGroup>
                <ListGroup.Item>
                  <strong>Nombre:</strong> {estudiante.nombreCompleto}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Correo Electrónico:</strong> {estudiante.correoElectronico}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Carrera:</strong> {estudiante.carrera}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Año de Ingreso:</strong> {estudiante.anioIngreso}
                </ListGroup.Item>
              </ListGroup>
              {
                estudiante.curriculum && 
                estudiante.curriculum !== "" &&
                <Button 
                    className='curriculum-button'
                    style={{marginTop: "2rem"}}
                    onClick={() => openDocument(estudiante.curriculum)}>
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
