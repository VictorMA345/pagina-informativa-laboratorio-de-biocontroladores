import React from "react";
import { Container } from "react-bootstrap";
import "./MainPageMiddleContainer.css";
import { Noticia } from "../../Models";
interface MainPageMiddleContainerProps{
  setItem : React.Dispatch<React.SetStateAction<Noticia | undefined>>;
  generalInfo : any;
}

export const MainPageMiddleContainer : React.FC<MainPageMiddleContainerProps> = ({generalInfo}) => {
  const imageContainerStyle = {
    backgroundImage: `url(${generalInfo?.imagenPrincipal})`, 
  };
  return (
    <Container className="middle-main-page-container">
      <div className="image-container" style={imageContainerStyle}>
        <div className="text-overlay">
          <br>
          </br>
          <h4>¿Quiénes Somos?</h4>
          <p>{ generalInfo && generalInfo.descripcion}</p>
          <h4>Misión</h4>
          <p>{ generalInfo && generalInfo.mision}</p>
          <h4>Visión</h4>
          <p>{ generalInfo && generalInfo.vision}</p>
        </div>
      </div>

    </Container>
  );
};
