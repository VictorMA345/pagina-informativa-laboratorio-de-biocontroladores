
import ListGroup from 'react-bootstrap/ListGroup';
import "./NewsContainer.css"
export const NewsContainer = () => {
  return (
    <ListGroup className="news-container" as="ul">
      <ListGroup.Item className="news-container-header" as="li">
        Noticias Recientes
      </ListGroup.Item>

      <ListGroup.Item className= "news-container-body" as="li">
        <h6>
          "Investigadores desarrollan un nuevo método de cultivo vertical para maximizar el espacio agrícola"
        </h6>
        <p>
          15 de julio de 2023
        </p>
      </ListGroup.Item >
      <ListGroup.Item as="li" className= "news-container-body">
        <h6>
          "Estudio destaca la importancia de la agricultura sostenible en la mitigación del cambio climático."
        </h6>
        <p>
          19 de noviembre de 2024
        </p>
      </ListGroup.Item>
      <ListGroup.Item as="li" className= "news-container-body">
        <h6>
          "Nueva tecnología agrícola revoluciona la detección de enfermedades en cultivos. "
        </h6>
        <p>
        2 de marzo de 2024
        </p>
      </ListGroup.Item>
      <ListGroup.Item as="li" className= "news-container-body">
        <h6>
        "Descubrimiento de nueva variedad de arroz resistente a sequías promete revolucionar la agricultura."
        </h6>
        <p>
         8 de junio de 2025
        </p>
      </ListGroup.Item>

            <ListGroup.Item as="li" className= "news-container-body">
        <h6>
        "Tecnología de edición genética mejora la producción de cultivos sin modificaciones transgénicas."
        </h6>
        <p>
          12 de enero de 2026
        </p>
      </ListGroup.Item>
      <ListGroup.Item as="li" className= "news-container-body">
        <h6>
        "Agrónomos promueven la agricultura regenerativa como solución a la degradación del suelo.""
        </h6>
        <p>
        5 de septiembre de 2026
        </p>
      </ListGroup.Item>
    </ListGroup>
  )
}
