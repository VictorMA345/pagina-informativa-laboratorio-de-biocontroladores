import React from 'react'
import { Enfermedad } from '../../Models'
import { Button,Dropdown, Card,ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './EnfermedadCardComponent.css';
import noImagePlaceholder from '../../images/no-image-placeholder.jpg';
interface CardComponentProps {
    item : Enfermedad | undefined;
    setSelectedItem: React.Dispatch<React.SetStateAction<Enfermedad | undefined>>;
}
import { useTranslation } from 'react-i18next'
export const EnfermedadCardComponent: React.FC<CardComponentProps> = ({item,setSelectedItem}) => {
    const formatDate = (date: string | { $date: string }) => {
        if (typeof date === 'string') {
            const originalDate = new Date(date);
            originalDate.setUTCHours(0, 0, 0, 0);
            const year = originalDate.getUTCFullYear();
            const month = `0${originalDate.getUTCMonth() + 1}`.slice(-2);
            const day = `0${originalDate.getUTCDate()}`.slice(-2);
            return `${year}-${month}-${day}`;
        }  else if (typeof date === 'object' && '$date' in date){
            const originalDate = new Date(date.$date);
            originalDate.setUTCHours(0, 0, 0, 0);
            const year = originalDate.getUTCFullYear();
            const month = `0${originalDate.getUTCMonth() + 1}`.slice(-2);
            const day = `0${originalDate.getUTCDate()}`.slice(-2);
            return `${year}-${month}-${day}`;
        }
    };
    const { t } = useTranslation(); 
  return (
    <Card className="enfermedad-card-component">
        <Card.Header>   
            <h6>
                {item?.enfermedad}    
            </h6>
            <p>
                {item ? formatDate(item?.createdAt) : ""} 
            </p>
        </Card.Header>            
        {(item && item.imagenes.length !== 0)? (
            <Card.Img
            variant="top"
            src={item.imagenes[0]}
            style={{ maxWidth: '100%', maxHeight: '50%', minHeight: '50%', objectFit: 'cover' }}
            />
        ) : (
            <Card.Img 
            variant="top"
            src={noImagePlaceholder}
            style={{ maxWidth: '100%', maxHeight: '50%', minHeight: '50%', objectFit: 'cover' }}
            />
        )}
        <ListGroup className='enfermedad-card-listgroup'>
            <ListGroup.Item>
                <label>
                    {t('agente_causal')}:
                </label>
                <p>
                    {item?.fitopatogeno}
                </p>
            </ListGroup.Item>
            <ListGroup.Item>
                <label>
                    {t('cultivos_afectados')}:
                </label>

                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        {t('ver_cultivos')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        {item?.cultivo.map((cultivo,index) => (
                            <Dropdown.Item key={index}> 
                                {cultivo}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </ListGroup.Item>

            <ListGroup.Item>
                <p className="description">
                    {item?.descripcion}
                </p>
            </ListGroup.Item>

        </ListGroup>
            <Card.Footer className="enfermedad-card-footer">
            <Link className = "enfermedad-card-button-link" to = {`/fitopatogenos/${item?._id}`}>
                <Button 
                onClick={() => setSelectedItem(item)}
                className="enfermedad-card-button">
                    {t('leer_mas')}
                </Button>
            </Link>
        </Card.Footer>
    </Card>
  )
}
