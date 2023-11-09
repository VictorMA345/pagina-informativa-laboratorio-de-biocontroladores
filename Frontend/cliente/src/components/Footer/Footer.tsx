import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { ContactModal } from '..';
import './Footer.css'
interface FooterProps {
  generalInfo: any 
}
import { useTranslation } from 'react-i18next'

export const Footer : React.FC<FooterProps> = ({generalInfo}) => {
  const { t } = useTranslation();
  const [contactModal, setcontactModal] = useState<boolean>(false)

  

  return (
    <>
    <MDBFooter bgColor='light' style ={{"background":"#C0C0C0"}}className=' text-center text-lg-start text-muted footer-container'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
      </section>
      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4 footer-text-container'>
                <Button 
                  onClick={() => setcontactModal(!contactModal)}
                  className='contact-button'
                >
                    {t('contactenos')}
                </Button>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>
                    {t('informacion_de_contacto')}
                </h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />
                { generalInfo && generalInfo.direccion }
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                { generalInfo && generalInfo.correo }
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' />
                { generalInfo && generalInfo.telefono }
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <a className='text-reset fw-bold'>
          {t('laboratorio')}
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