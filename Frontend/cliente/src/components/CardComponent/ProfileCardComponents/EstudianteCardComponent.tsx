import React from 'react'
import { Card, ListGroup,Row,Col, Button } from 'react-bootstrap';
import NoImagePlaceHolder from '../../../images/no-image-placeholder.jpg'
import { Estudiante } from '../../../Models';
import './ProfileCardComponent.css'
import { useTranslation } from 'react-i18next'
interface EstudianteCardComponentProps {
    estudiante: Estudiante
}
export const EstudianteCardComponent:React.FC<EstudianteCardComponentProps> = ({estudiante}) => {
    const { t } = useTranslation();
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
                  <strong>{t('nombre')}:</strong> {estudiante.nombreCompleto}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>{t('correo')}:</strong> {estudiante.correoElectronico}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>{t('carrera')}:</strong> {estudiante.carrera}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>{t('anioIngreso')}:</strong> {estudiante.anioIngreso}
                </ListGroup.Item>
              </ListGroup>
              {
                estudiante.curriculum && 
                estudiante.curriculum !== "" &&
                <Button 
                    className='curriculum-button'
                    style={{marginTop: "2rem"}}
                    onClick={() => openDocument(estudiante.curriculum)}>
                    {t('ver_curriculum')}
                    <i className='bx bxs-file-pdf'></i>
                </Button>
              }
            </Card.Body>
          </Col>
        </Row>
      </Card>
  )
}
