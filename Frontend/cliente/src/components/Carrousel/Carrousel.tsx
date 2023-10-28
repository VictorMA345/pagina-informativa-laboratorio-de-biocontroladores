import { useEffect,useState} from 'react'
import { Carousel,Button } from 'react-bootstrap';
import { getAllEnfermedad,getAllControlBiologico } from '../../services';
import { ControlBiologico,Enfermedad } from '../../Models';
import NoImagePlaceHolder from '../../images/no-image-placeholder.jpg'
import './Carrousel.css'
export const Carrousel = () => {
  const [enfermedades, setenfermedades] = useState<Enfermedad[]>([])
  const [controlBiologico, setcontrolBiologico] = useState<ControlBiologico[]>([])
  useEffect(() => {
    const fetchImages = async() => {
      const fetchedEnfermedades = await getAllEnfermedad(4,1);
      const fetchedControl_biologico = await getAllControlBiologico(4,1);
      setenfermedades(fetchedEnfermedades.data.map((enfermedad) => enfermedad))
      setcontrolBiologico(fetchedControl_biologico.data.map((control) => control))
    }
    fetchImages();
  }, [])
  
  return (
    <div className="carrousel-container">
        <Carousel interval={5000} fade>
          {enfermedades.map((enfermedad) =>
            <Carousel.Item key={enfermedad._id}>
              <img
                className="d-block w-100" // Añade las clases Bootstrap aquí para ajustar el tamaño de la imagen
                src={(enfermedad.imagenes[0] && enfermedad.imagenes.length !== 0) ? enfermedad.imagenes[0] : NoImagePlaceHolder}
                alt={(enfermedad.imagenes[0] && enfermedad.imagenes.length !== 0) ? enfermedad.imagenes[0] : NoImagePlaceHolder}
              />
              <Carousel.Caption>
                <h5>{enfermedad.enfermedad}</h5>
                <p>
                  {enfermedad.descripcion}
                </p>
                <Button variant="success">Ver más</Button> 
              </Carousel.Caption>
            </Carousel.Item>
          )}

          {controlBiologico.map((controlBiologico) =>
            <Carousel.Item key={controlBiologico._id}>
              <img
                className="d-block w-100" 
                src={controlBiologico.imagenes && controlBiologico.imagenes.length !== 0 ? controlBiologico.imagenes[0] : NoImagePlaceHolder}
                alt="Primera imagen"
              />
              <Carousel.Caption>
                <h5>{controlBiologico.nombreInvestigacion}</h5>
                <p>
                  {controlBiologico.textoExplicativo}
                </p>
                <Button variant="success">Ver más</Button> 
              </Carousel.Caption>
            </Carousel.Item>
          )}
        </Carousel>
    </div>
  );
};

