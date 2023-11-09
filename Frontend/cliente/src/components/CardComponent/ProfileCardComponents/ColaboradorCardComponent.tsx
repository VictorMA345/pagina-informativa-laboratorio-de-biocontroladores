import React,{useState,useEffect} from 'react';
import { Card, Row, Col, ListGroup } from 'react-bootstrap';
import { Colaborador, Proyecto } from '../../../Models';
import NoImagePlaceHolder from '../../../images/no-image-placeholder.jpg';
import { getProyecto } from '../../../services/ProyectoService';
import './ProfileCardComponent.css'
interface ColaboradorProps {
  colaborador: Colaborador;
}
import { useTranslation } from 'react-i18next'
export const ColaboradorCardComponent: React.FC<ColaboradorProps> = ({ colaborador }) => {
    const { t } = useTranslation();
    const [proyectosList,setproyectosList] = useState<(string | undefined)[]>([]);
    useEffect(() => {
        const fetchproyectos = async () => {
          if (colaborador) {
            const proyectoPromises = colaborador.proyectosColaborados.map((proyecto) => getProyecto(proyecto));
            try {
              const proyectos = await Promise.all(proyectoPromises);
              const nombresCompletos = proyectos.map((proyecto: Proyecto | undefined) => proyecto?.tituloProyecto);
              setproyectosList(nombresCompletos);
            } catch (error) {
              console.error('Error al obtener los miembros:', error);
            }
          }
        };
        fetchproyectos();
      }, [colaborador]);
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
              src={colaborador.fotoPerfil ? colaborador.fotoPerfil : NoImagePlaceHolder}
              style={{ objectFit: 'cover', maxHeight: '100%', maxWidth: '100%' }}
            />
          </div>
        </Col>
        <Col md={6}>
          <Card.Body>
            <Card.Title>{colaborador.nombreCompleto}</Card.Title>
            <ListGroup>
              <ListGroup.Item>
                <strong> {t('nombre')}:</strong> {colaborador.nombreCompleto}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>{t('disciplinas_de_estudio')}:</strong>
                <ul>
                  {colaborador.listaEstudios.map((estudio, index) => (
                    <li key={index}>{estudio}</li>
                  ))}
                </ul>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong> {t('proyectos_vinculacion')}:</strong>
                <ul>
                  {proyectosList.map((proyecto, index) => (
                    proyecto && proyecto !== "" && <li key={index}>{proyecto}</li>
                  ))}
                </ul>
              </ListGroup.Item>
            </ListGroup>
            <Card.Text>
              <strong>{t('perfil_academico')}</strong>
              <p style={{textIndent:"2rem",padding:"1rem"}}>
                {colaborador.descripcion}
              </p>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};
