import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './UpperNavbar.css'; // Importa el archivo CSS
import logo from '../../images/logo.png';
import logoTec from '../../images/logo-tec.png'
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export const UpperNavbar = () => {
  const logoStyle = {
    maxWidth: '250px', 
    maxHeight: '75px',
  };

  
  return (
      <Navbar expand="lg" className="navbar-custom" >
        <Container style={{"marginLeft":"2rem"}}>   
          <Link to= "/">
            <img className="logo-image" src={logo} alt="" style={logoStyle} />
          </Link>
          <img className="logo-image" src={logoTec} alt="" style={logoStyle} />
        </Container>
      </Navbar>
  );
};
