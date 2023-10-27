import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SectionLabel.css'
interface SectionLabelProps {
  label : string
}
export const SectionLabel : React.FC<SectionLabelProps>= ({label}) => {
  return (
    <Container className='section-label-container'>
      <Row>
        <Col>
            <h1>
                {label}
            </h1>
        </Col>
      </Row>
    </Container>
  )
}
