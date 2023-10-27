import React from "react";
import { Modal,Button,Form } from "react-bootstrap";
import './ContactModal.css'
interface ContactModal {
    show: boolean;
    setShowModal :React.Dispatch<React.SetStateAction<boolean>>;
}
export const ContactModal: React.FC<ContactModal> = ({show,setShowModal}) => {
    return (
        <Modal show={show} onHide={() => setShowModal(!show)}>
            <Modal.Header closeButton>
            <Modal.Title>Contactenos</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form>
                    <Form.Label>
                        Nombre
                    </Form.Label>
                    <Form.Control type="text">

                    </Form.Control>
                    <Form.Label>
                        Correo Electrónico
                    </Form.Label>
                    <Form.Control type="text">

                    </Form.Control>
                    <Form.Label>
                        Asunto
                    </Form.Label>
                    <Form.Control type="text">

                    </Form.Control>
                    <Form.Label>
                        Mensaje
                    </Form.Label>
                    <Form.Control as="textarea" rows = {7}>

                    </Form.Control>

                </Form>
            </Modal.Body>
            
            <Modal.Footer className="contact-modal-footer">
            <Button className="contact-modal-send-button" onClick={() => setShowModal(!show)}>
                Enviar
            </Button>

            </Modal.Footer>
        </Modal>
    )
}
