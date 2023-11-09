import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Nav,NavDropdown } from 'react-bootstrap';

import './LowerNavbar.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export const LowerNavbar = () => {
  const { t,i18n} = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
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
                {t('fitopatogenos')}
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/control_biologico"
              >
              {t('control_biologico')}
              </Link>
            </Nav.Link>
            <NavDropdown title={t('colaboradores')} className='dropdown-nav-link' id="nav-dropdown">
            <NavDropdown.Item as={Link} to='/asistentes'>
              {t('asistentes')}
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/estudiantes'>
              {t('estudiantes')}
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to='/investigadores'>
              {t('investigadores')}
            </NavDropdown.Item>
        </NavDropdown>
            <Nav.Link >
              <Link
                className='navbar-link' 
                to= "/tesis"
              >
                {t('tesis')}
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/servicios"
              >
                {t('servicios')}
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/proyectos"
              >
                {t('proyectos')}
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className='navbar-link' 
                to= "/noticias"
              >
                {t('noticias')}
              </Link>
              </Nav.Link>

              <Nav.Link>
              <div className="nav-wrapper">
                <div className="sl-nav">
                  {t('idioma')}:
                  <ul>
                    <li><b></b> <i className="fa fa-angle-down" aria-hidden="true"></i>
                      <div className="triangle"></div>
                      <ul>
                        <li onClick={() => changeLanguage("es")}><i className="sl-flag flag-es"><div id="germany"></div></i> Español</li>
                        <li onClick={() => changeLanguage("en")}><i className="sl-flag flag-usa"><div id="germany"></div></i> English</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
