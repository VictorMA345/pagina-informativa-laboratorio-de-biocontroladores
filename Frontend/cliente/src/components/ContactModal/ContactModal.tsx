import React,{useState} from "react";
import { Modal,Button,Form,Toast     } from "react-bootstrap";
import './ContactModal.css'
import { sendMail } from "../../services";
interface ContactModal {
    show: boolean;
    setShowModal :React.Dispatch<React.SetStateAction<boolean>>;
}
export const ContactModal: React.FC<ContactModal> = ({show,setShowModal}) => {

    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("");
    const [asunto, setAsunto] = useState("");
    const [cuerpo, setCuerpo] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    
    const showToastMessage = (message: string) => {
        setToastMessage(message);
        setShowToast(true);
    };
    const submit = async () => {
        const res = await sendMail(nombre, asunto, correo, cuerpo);
        if (!res.success) {
            showToastMessage("Error al enviar el correo");
        } else {
            showToastMessage("Correo enviado con éxito");
        }
    };
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
                    <Form.Control value= {nombre} onChange={(e) => setNombre(e.target.value)} type="text">
                    </Form.Control>
                    <Form.Label>
                        Correo Electrónico
                    </Form.Label>
                    <Form.Control type="text" value={correo} onChange={(e) => setCorreo(e.target.value)}>
                    </Form.Control>
                    <Form.Label>
                        Asunto
                    </Form.Label>
                    <Form.Control type="text" value = {asunto} onChange={(e) => setAsunto(e.target.value)}> 
                    </Form.Control>
                    <Form.Label>
                        Mensaje
                    </Form.Label>
                    <Form.Control as="textarea" rows = {7} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)}>
                    </Form.Control>
                </Form>
            </Modal.Body>
            
            <Modal.Footer className="contact-modal-footer">
            <Button className="contact-modal-send-button" onClick={() => (setShowModal(!show),submit())}>
                Enviar
            </Button>
            </Modal.Footer>
            <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                <Toast.Header>
                    <strong className="mr-auto">Mensaje</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </Modal>
    )
}
