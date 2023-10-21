import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import './UpperNavbar.css'; // Importa el archivo CSS

export const UpperNavbar = () => {
  return (
      <Navbar expand="lg" className="navbar-custom" >
        <Container style={{"marginLeft":"2rem"}}>   
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link href="#home" className="nav-link-custom">
                Miembros
              </Nav.Link>
              <Nav.Link href="#link" className="nav-link-custom">
                Pasantes
              </Nav.Link>
              <Nav.Link href="#link" className="nav-link-custom">
                Colaboradores
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
};
