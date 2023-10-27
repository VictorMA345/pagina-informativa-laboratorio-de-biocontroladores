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
export const EnfermedadCardComponent: React.FC<CardComponentProps> = ({item,setSelectedItem}) => {
    const formatDate = (date: any) => {
        const options : Object = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
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
                    Agente Causal:
                </label>
                <p>
                    {item?.fitopatogeno}
                </p>
            </ListGroup.Item>
            <ListGroup.Item>
                <label>
                    Cultivos Afectados:
                </label>

                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Ver cultivos
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
            <Link className = "enfermedad-card-button-link" to = {`/enfermedades/${item?._id}`}>
                <Button 
                onClick={() => setSelectedItem(item)}
                className="enfermedad-card-button">
                    Leer más
                </Button>
            </Link>
        </Card.Footer>
    </Card>
  )
}
