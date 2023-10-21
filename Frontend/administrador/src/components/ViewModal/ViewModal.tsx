import { ReactNode } from "react";
import "./ViewModal.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Accordion from 'react-bootstrap/Accordion';
import React, { useState,useEffect } from "react";
import { Form } from "react-bootstrap";
interface ViewModalInterface {
    setViewModal: React.Dispatch<React.SetStateAction<boolean>>,
    openViewModal: boolean,
    id : string,
    getMethod : (id: string) => any,
    dataStructure : Object
}
export const ViewModal : React.FC<ViewModalInterface> = ({openViewModal,setViewModal,id,getMethod,dataStructure}) => {
    const [selectedItem, setSelectedItem] = useState<Object | undefined>(undefined)
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getMethod(id); 
            setSelectedItem(data);
          } catch (error) {
            console.log(error);
          }
        }
        fetchData();
      }, [id,openViewModal]);
      
    const handleClose = () =>{
        setViewModal(!openViewModal)
        setSelectedItem(undefined);
    }
    return (
        <>
            <Modal className='view-modal' show={openViewModal} onHide={handleClose}>
                <Modal.Header className='view-modal-header'>
                    <Modal.Title>
                        Ver
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='view-modal-body'>
                    {
                        Object.values(dataStructure).map((key) => (
                            <div>
                            {
                                key.type === "document" &&
                                <div className="view-field">
                                    <h4 className='mb-2'>{key.name}</h4>
                                    <iframe className= "document-container"src={selectedItem && selectedItem[key.keyName]} width="100%" height="500px" title="PDF"></iframe>
                                </div>
                            }
                            {
                                key.type === "single-image" &&
                                <div className="view-field">
                                    <h4 className='mb-2'>{key.name}</h4>
                                    <img className = 'single-image-container'src={selectedItem && selectedItem[key.keyName]} width="100%" height="500px" title="PDF" />
                                </div>
                            }
                            {
                                key.type === "multiple-images" &&
                                <div className="view-field">
                                    <h4 className='mb-2'>{key.name}</h4>
                                    {selectedItem &&
                                    selectedItem[key.keyName].map((item, index) => (
                                        <img
                                            key={index} 
                                            src={item} 
                                            width="100px" 
                                            height="75px"  
                                        />
                                    ))}
                                </div>
                            }
                            {
                                (key.type === "text" || key.type === "selectable-text") && 
                                    <div className="view-field">
                                        <h4 className='mb-2'>{key.name}</h4>
                                        <h6 className='mb-3'>{ selectedItem && selectedItem[key.keyName] } </h6>
                                    </div> 
                            }
                            {
                                key.type === "selectable-fetched-text" && 
                                <div className="view-field">
                                    <h4 className='mb-2'>{key.name}</h4>
                                    {
                                        key.choices_id.map((item,index) =>{
                                            if (selectedItem && (selectedItem[key.keyName] === item)){
                                                return(
                                                    <h6 className='mb-3'>
                                                        { key.choices[index] }
                                                    </h6>
                                                )
                                            }
                                        })
                                    }
                                </div> 
                            }
                            { 
                                key.type === "large-text" && 
                                    <div className="view-field">
                                        <Accordion defaultActiveKey="0">
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header> 
                                                    {key.name}
                                                </Accordion.Header>
                                                <Accordion.Body style = {{"fontWeight":"normal"}}>
                                                    { selectedItem && selectedItem[key.keyName] } 
                                                </Accordion.Body>
                                            </Accordion.Item>   
                                        </Accordion>
                                    </div> 
                            }
                            {
                                 key.type === "selectable-fetched-list-text"  && 
                                 <div className="view-field">
                                    <h4 className='mb-2'>{key.name}</h4>   
                                    <Dropdown>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Ver {`${key.name}`}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu className="scrollable-dropdown-menu">
                                        {
                                            key.choices_id.map((choice_id,index) =>{
                                                return(
                                                selectedItem && selectedItem[key.keyName].map((item)=>{
                                                    if(item === choice_id){
                                                        return (
                                                            <Dropdown.Item>
                                                                {key.choices[index]}
                                                            </Dropdown.Item>
                                                        )
                                                    }
                                                })
                                                )
                                            })
                                        }   
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            }
                            { 
                                key.type === "list" && 
                                    <div className="view-field">
                                        <h4 className='mb-2'>{key.name}</h4>
                                        <Dropdown>
                                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                                    Ver {`${key.name}`}
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu className="scrollable-dropdown-menu">
                                                    {
                                                    selectedItem && selectedItem[key.keyName].map((item) =>
                                                            (  
                                                                <Dropdown.Item>
                                                                    { item as ReactNode }
                                                                </Dropdown.Item>
                                                            )
                                                    )
                                                    }
                                                </Dropdown.Menu>
                                        </Dropdown> 
                                    </div>
                            }

                            {
                                key.type === "date" && 
                                    <div className="view-field">
                                        <h4 className='mb-2'>{key.name}</h4>
                                        <h6 className='mb-3'>{ selectedItem && selectedItem[key.keyName] } </h6>
                                    </div> 
                            }
                            {
                                (key.type === "permissions" || key.type === "general-permissions") && 
                                    <div className="view-field">
                                        <h4 className='mb-2'>{key.name}</h4>
                                        {
                                                selectedItem && selectedItem[key.keyName] && Object.entries(selectedItem[key.keyName]).map(([clave, valor]) => (
                                            <div key={clave}>
                                                <Form.Check 
                                                    disabled
                                                    type="switch"
                                                    label={clave}
                                                    id="disabled-custom-switch"
                                                    defaultChecked={valor ? true : false}
                                                />
                                            </div>
                                            ))
                                        }
                                    </div> 
                            }
                            </div>
                        ))

                    }
                </Modal.Body>
                <Modal.Footer className='view-modal-footer'>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
