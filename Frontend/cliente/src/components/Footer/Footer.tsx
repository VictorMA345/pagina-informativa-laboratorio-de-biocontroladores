import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import { ContactModal } from '..';
import logo from '../../images/logo.png';
import './Footer.css'
export const Footer = () => {

  const [contactModal, setcontactModal] = useState<boolean>(false)
  const logoStyle = {
    maxWidth: '300px',
    maxHeight: '125px', 
  };
  return (
    <>
    <MDBFooter bgColor='light' style ={{"background":"#C0C0C0"}}className='text-center text-lg-start text-muted footer-container'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>

      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='4' xl='3' className='mx-auto mb-4'>
              <img className="logo-image" src={logo} alt="" style={logoStyle} />
            </MDBCol>

           
            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
                <Button 
                  onClick={() => setcontactModal(!contactModal)}
                  className='contact-button'
                >
                    Contactenos  
                </Button>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>
                    Información de contacto.
                </h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />
                "Dirección del laboratorio"
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                correoElectrónico@gmail.com
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' /> + 01 234 567 88
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <a className='text-reset fw-bold'>
          Laboratorio de fitopatología y biocontroladores
        </a>
      </div>
    </MDBFooter>
    <ContactModal 
      show= {contactModal}
      setShowModal={setcontactModal}
    />

    </>
  );
}