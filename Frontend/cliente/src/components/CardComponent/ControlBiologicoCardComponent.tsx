import React from 'react'
import { ControlBiologico } from '../../Models'
import { Button, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './ControlBiologicoCardComponent.css';
import noImagePlaceholder from '../../images/no-image-placeholder.jpg';
import { useTranslation } from 'react-i18next'
interface CardComponentProps {
    item : ControlBiologico | undefined;
    setSelectedItem: React.Dispatch<React.SetStateAction<ControlBiologico | undefined>>;
}
export const ControlBiologicoCardComponent: React.FC<CardComponentProps> = ({item,setSelectedItem}) => {
    const formatDate = (date: string) => {
        const originalDate = new Date(date);
        originalDate.setUTCHours(0, 0, 0, 0);
        const year = originalDate.getUTCFullYear();
        const month = `0${originalDate.getUTCMonth() + 1}`.slice(-2);
        const day = `0${originalDate.getUTCDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };
    const { t } = useTranslation();
  return (
    <Card className="control-biologico-card-component">
        <Card.Header>   
            <h6>
                {item?.nombreInvestigacion}    
            </h6>
            <p>
                {item ? formatDate(item?.fechaPublicacion) : ""} 
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
        <ListGroup className='control-biologico-card-listgroup'>

            <ListGroup.Item className='description-text'>
                <h6>
                    {t('investigacion')}:
                </h6>
                <p>
                    {item?.textoExplicativo}
                </p>
            </ListGroup.Item>
        </ListGroup>
            <Card.Footer className="control-biologico-card-footer">
                <Link className = "control-biologico-card-button-link" to = {`/control_biologico/${item?._id}`}>
                    <Button 
                    onClick={() => setSelectedItem(item)}
                    className="control-biologico-card-button">
                        {t('leer_mas')}
                    </Button>
                </Link>
            </Card.Footer>
    </Card>
  )
}
