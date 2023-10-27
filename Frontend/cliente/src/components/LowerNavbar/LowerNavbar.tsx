import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import logo from '../../images/logo.png';
import './LowerNavbar.css';
import { Link } from 'react-router-dom';
export const LowerNavbar = () => {
  const logoStyle = {
    maxWidth: '250px', // Ancho máximo de la imagen
    maxHeight: '75px', // Altura máxima de la imagen
  };

  return (
    <Navbar className='lower-navbar' expand="md">
      <Container className="lower-navbar-container">
        <Navbar.Brand >
          <Link to= "/">
            <img className="logo-image" src={logo} alt="" style={logoStyle} />
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='lower-navbar-links'>
            <Nav.Link >
              <Link
                className='navbar-link' 
                to= "/enfermedades"
              >
                Enfermedad
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/control_biologico"
              >
              Control biológico
              </Link>
            </Nav.Link>
            <Nav.Link >
              <Link
                className='navbar-link' 
                to= "/tesis"
              >
                Tesis
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/servicios"
              >
                Servicios
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/proyectos"
              >
                Proyectos de Investigación
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/noticias"
              >
                Noticias
              </Link>
              </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
