import React,{useState} from "react";
import { Modal,Form     } from "react-bootstrap";
import './ContactModal.css'
import { sendMail } from "../../services";
import { useTranslation } from 'react-i18next'
interface ContactModal {
    show: boolean;
    setShowModal :React.Dispatch<React.SetStateAction<boolean>>;
}
export const ContactModal: React.FC<ContactModal> = ({show,setShowModal}) => {
    const { t } = useTranslation();
    
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("");
    const [asunto, setAsunto] = useState("");
    const [cuerpo, setCuerpo] = useState("");

    const submit = async () => {
        await sendMail(nombre, asunto, correo, cuerpo);
    };
    return (
        <Modal show={show} onHide={() => setShowModal(!show)}>
            <Modal.Header closeButton>
            <Modal.Title>{t('contactenos')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Label>
                        {t('nombre')}
                    </Form.Label>
                    <Form.Control value= {nombre} onChange={(e) => setNombre(e.target.value)} type="text">
                    </Form.Control>
                    <Form.Label>
                        {t('correo')}
                    </Form.Label>
                    <Form.Control type="text" value={correo} onChange={(e) => setCorreo(e.target.value)}>
                    </Form.Control>
                    <Form.Label>
                        {t('asunto')}
                    </Form.Label>
                    <Form.Control type="text" value = {asunto} onChange={(e) => setAsunto(e.target.value)}> 
                    </Form.Control>
                    <Form.Label>
                        {t('mensaje')}
                    </Form.Label>   
                    <Form.Control as="textarea" rows = {7} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)}>
                    </Form.Control>
                </Form>
            </Modal.Body>
            
            <Modal.Footer className="contact-modal-footer">
            <button className="contact-modal-send-button" onClick={() => (setShowModal(!show),submit())}>
                Enviar
            </button>
            </Modal.Footer>

        </Modal>
    )
}
