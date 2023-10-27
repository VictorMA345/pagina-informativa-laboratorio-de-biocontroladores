import { Container } from "react-bootstrap";
import { NewsContainer } from "..";
import "./MainPageMiddleContainer.css";

export const MainPageMiddleContainer = () => {
  const longText =
    "Somos un laboratorio pionero en la vanguardia de la investigación y desarrollo de soluciones biocontroladoras para la agricultura sostenible. Nuestro compromiso radica en proporcionar alternativas eficaces y amigables con el medio ambiente para proteger los cultivos y promover prácticas agrícolas responsables.";

  const mission =
    "Ser líderes globales en la investigación y desarrollo de soluciones biocontroladoras, contribuyendo al equilibrio ecológico y la sostenibilidad agrícola.";

  const vision =
    "Desarrollar y proporcionar biocontroladores innovadores y eficaces que protejan los cultivos de manera natural, promoviendo prácticas agrícolas respetuosas con el medio ambiente y la seguridad alimentaria.";

  return (
    <Container className="middle-main-page-container">
      <div className="image-container">
        <div className="text-overlay">
          <h2 className="main-page-image-title">Laboratorio Biocontroladores</h2>
          <h4>¿Quienes Somos?</h4>
          <p>{longText}</p>
          <h4>Misión</h4>
          <p>{mission}</p>
          <h4>Visión</h4>
          <p>{vision}</p>
        </div>
      </div>
      <NewsContainer />
    </Container>
  );
};
