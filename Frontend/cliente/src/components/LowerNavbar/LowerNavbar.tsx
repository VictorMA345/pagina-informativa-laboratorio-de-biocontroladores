import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import logo from '../../images/logo.png';
import './LowerNavbar.css';

export const LowerNavbar = () => {
  const logoStyle = {
    maxWidth: '250px', // Ancho máximo de la imagen
    maxHeight: '75px', // Altura máxima de la imagen
  };

  return (
    <Navbar className='lower-navbar' expand="md">
      <Container className="lower-navbar-container">
        <Navbar.Brand href="#home">
          <img className="logo-image" src={logo} alt="" style={logoStyle} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='lower-navbar-links'>
            <Nav.Link href="#home">Enfermedad</Nav.Link>
            <Nav.Link href="#features">Control biológico</Nav.Link>
            <Nav.Link href="#pricing">Tesis</Nav.Link>
            <Nav.Link href="#23">Servicios</Nav.Link>
            <Nav.Link href="#213">Proyectos de Investigación</Nav.Link>
            <Nav.Link href="#1234">Noticias</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
