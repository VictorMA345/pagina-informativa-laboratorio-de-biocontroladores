import React, { useEffect,useState } from 'react'
import { Card, ListGroup,Row,Col, Button } from 'react-bootstrap';
import NoImagePlaceHolder from '../../../images/no-image-placeholder.jpg'
import './ProfileCardComponent.css'
import { Miembro } from '../../../Models';
import { getProyecto } from '../../../services';
import { useTranslation } from 'react-i18next'
interface MiembroCardComponentProps {
    miembro: Miembro
}
export const MiembroCardComponent:React.FC<MiembroCardComponentProps> = ({miembro}) => {
    const [proyectos,setProyectos] = useState<(string|undefined)[]>([]);
    const { t } = useTranslation();
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
                  <strong>{t('nombre')}:</strong> {miembro.nombreCompleto}
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>{t('correo')}:</strong> {miembro.correo}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>{t('areas_especializacion')}:</strong>
                  <ul>
                    {miembro.areaEspecializacion.map((estudio, index) => (
                      <li key={index}>{estudio}</li>
                    ))}
                  </ul>
                </ListGroup.Item>

                <ListGroup.Item>
                  <strong>{t('proyectos_participados')}:</strong>
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
                <strong>{t('perfil_academico')}:</strong>
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
