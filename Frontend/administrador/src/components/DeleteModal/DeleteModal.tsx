import {useState} from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { LoadingModal,NotificationToast } from '..';
import "./DeleteModal.css"
interface DeleteModalInterface {
    actions: any,
    openDeleteModal: boolean,
    setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>,
    id : string,
    deleteMethod : (id: string) => any
}
export const DeleteModal : React.FC<DeleteModalInterface> = ({ actions,openDeleteModal,setDeleteModal,id,deleteMethod}) => {
    const handleClose = () =>{
        setDeleteModal(!openDeleteModal)
    }
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const [toast,setToast] = useState<boolean>(false)
    const [toastType,setToastType] = useState<string>("");
    const [toastStateMsg,setToastStateMsg] = useState<string>("")
    const [resultMsg,setResultMsg] = useState("");
    const LoadingModalContent = () => {
        if (isLoading === true) {
          return <LoadingModal 
                    show={isLoading} 
                    headerLabel="Eliminando Documento"
                    bodyLabel=" Eliminando ...."
                />;
        } else {
          return (
            null
          );
        }
      };
    const deleteObject = async() =>{
        handleClose();
        setIsLoading(true)
        const timeoutMilliseconds = 60000;  
        const timeoutId = setTimeout(() => {
            setIsLoading(false);
            setToastStateMsg("No se ha podido eliminar el documento!")
            setResultMsg("Se ha agotado el tiempo!")
            setToastType("failure");
            setToast(true)
        }, timeoutMilliseconds);
        const success = await deleteMethod(id);
        clearTimeout(timeoutId);
        if (!success.error) {
          actions({
            type: 'DELETE_ITEM',
            id: id
          });
          setToastStateMsg("Se ha eliminado el documento con éxito!")
          setResultMsg("Se ha eliminado el documento con éxito!")
          setToastType("success");
          setToast(true)
          setIsLoading(false);
        } else {
            setIsLoading(false);
            setToastStateMsg("No se ha podido eliminar el documento!")
            setResultMsg(success.error)
            setToastType("failure");
            setToast(true)
        }

        setIsLoading(false)
    }
    return (
        <>
            <Modal className='delete-modal' show={openDeleteModal} onHide={handleClose}>
                <Modal.Header className='delete-modal-header'>
                    <Modal.Title>
                        ¿Estás seguro que quieres eliminar este elemento?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='delete-modal-body'>
                    ¡El elemento se eliminará permanentemente de la base de datos!
                </Modal.Body>
                <Modal.Footer className='delete-modal-footer'>
                    <Button variant="success" onClick={deleteObject}>
                        Si
                    </Button>   
                    <Button variant="danger" onClick={handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
            <LoadingModalContent />
            <NotificationToast 
                open = {toast}
                setOpen = {setToast}
                headerLabel={toastStateMsg}
                label={resultMsg}
                type={toastType}
            />
        </>
    )
}
