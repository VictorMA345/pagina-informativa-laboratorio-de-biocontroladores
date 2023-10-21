import { Carousel,Button } from 'react-bootstrap';
import './Carrousel.css'
export const Carrousel = () => {
  return (
<div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <Carousel interval={5000} fade>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://st.depositphotos.com/1016440/2534/i/450/depositphotos_25344733-stock-photo-sunrise-at-the-beach.jpg"
                alt="Primera imagen"
              />
              <Carousel.Caption>
                <h3>Título de la primera imagen</h3>
                <p>Descripción de la primera imagen.</p>
                <Button variant="success">Ver más</Button> 
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="https://media.istockphoto.com/id/636379014/es/foto/manos-la-formación-de-una-forma-de-corazón-con-silueta-al-atardecer.jpg?s=612x612&w=0&k=20&c=R2BE-RgICBnTUjmxB8K9U0wTkNoCKZRi-Jjge8o_OgE="
                alt="Segunda imagen"
              />
              <Carousel.Caption>
                <h3>Título de la segunda imagen</h3>
                <p>Descripción de la segunda imagen.</p>
                <Button variant="success">Ver más</Button> 
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

