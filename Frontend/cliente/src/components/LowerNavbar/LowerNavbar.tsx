import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Nav,NavDropdown } from 'react-bootstrap';

import './LowerNavbar.css';
import { Link } from 'react-router-dom';
export const LowerNavbar = () => {
  return (
    <Navbar className='lower-navbar' expand="md">
      <Container className="lower-navbar-container">
        <Navbar.Brand >
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='lower-navbar-links'>
            <Nav.Link >
              <Link
                className='navbar-link' 
                to= "/fitopatogenos"
              >
                Fitopatógenos
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
            <NavDropdown title="Colaboradores" className='dropdown-nav-link' id="nav-dropdown">
            <NavDropdown.Item as={Link} to='/asistentes'>
              Asistentes
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/estudiantes'>
              Pasantes y tesiarios
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/investigadores'>
              Investigadores
            </NavDropdown.Item>
        </NavDropdown>
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
