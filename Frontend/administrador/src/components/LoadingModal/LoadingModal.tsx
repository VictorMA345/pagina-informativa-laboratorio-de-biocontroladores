import "./LoadingModal.css"
import { Modal, Spinner } from 'react-bootstrap';
import { ReactNode } from "react"
export const LoadingModal : React.FC<{ show: boolean,headerLabel: string,bodyLabel:string }> = ({ show,headerLabel,bodyLabel }) => {
  return (
    <Modal className= "custom-loading-modal" show={show} backdrop="static">
      <Modal.Header>
        <Modal.Title>{ headerLabel as ReactNode}</Modal.Title>    
      </Modal.Header>
      <Modal.Body className="custom-loading-modal-body">
        <Spinner animation="border" variant="primary" /> { bodyLabel as ReactNode}
      </Modal.Body>
    </Modal>
  )
}
