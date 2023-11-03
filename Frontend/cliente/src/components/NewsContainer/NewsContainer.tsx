import React,{useState,useEffect} from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import "./NewsContainer.css"
import { getAllNoticias } from '../../services';
import { Noticia } from '../../Models';
import { Link } from 'react-router-dom';
interface NoticiasContainerProps{
  setItem : React.Dispatch<React.SetStateAction<Noticia | undefined>>
}
export const NewsContainer: React.FC<NoticiasContainerProps> = ({setItem}) =>{
  const [noticias,SetNoticias] = useState<Noticia[] | undefined>(undefined)
  useEffect(() => {
    const fetchData = async() => {
      const fetchedNoticias = await getAllNoticias(6,1);
      SetNoticias(fetchedNoticias.data);
    } 
    fetchData();
  }, [])
  
  return (
    <ListGroup className="news-container" as="ul">
      <ListGroup.Item className="news-container-header" as="li">
        Noticias Recientes
      </ListGroup.Item>
      {
        noticias &&
        Object.values(noticias).map((noticia, index) => {
          const fecha = new Date(noticia.fechaPublicacion);
          const dia = fecha.getDate(); 
          const mes = fecha.toLocaleString('default', { month: 'long' });
          const año = fecha.getFullYear();
          return (
            <Link to ={`/noticias/${noticia._id}`} style={{textDecoration:"none"}}>
              <ListGroup.Item className="news-container-body" as="li" key={index} onClick={() => setItem(noticia)}>
                <h6>{noticia.titulo}</h6>
                <p> {dia}  de { mes } del { año} </p> 
              </ListGroup.Item>
            </Link>
          );
        })
      }
    </ListGroup>
  )
}
