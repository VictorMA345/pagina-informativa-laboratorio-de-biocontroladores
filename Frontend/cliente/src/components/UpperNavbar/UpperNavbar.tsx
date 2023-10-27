import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import './UpperNavbar.css'; // Importa el archivo CSS
import { Link } from 'react-router-dom';
export const UpperNavbar = () => {
  return (
      <Navbar expand="lg" className="navbar-custom" >
        <Container style={{"marginLeft":"2rem"}}>   
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link className="nav-link-custom">
                <Link
                  to = "/miembros"
                  className='upper-navbar-link' 
                >
                  Miembros
                </Link>
              </Nav.Link>
              <Nav.Link className="nav-link-custom">
                <Link
                    to = "/estudiantes"
                    className='upper-navbar-link' 
                >
                  Estudiantes
                </Link>
              </Nav.Link>
              <Nav.Link className="nav-link-custom">
                <Link
                    to = "/investigadores"
                    className='upper-navbar-link'  
                >
                  Investigadores
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};
