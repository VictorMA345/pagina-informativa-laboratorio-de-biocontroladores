import "./CreateModal.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { LoadingModal,NotificationToast } from "..";
import { 
    TextModalField,
    LargeTextModalField,
    DocumentModalField,
    DateModalField,
    ListModalField,
    PasswordModalField,
    DropdownModalField,
    SelectableListTextField,
    SingleImageUploadModalField, 
    MultiImageUploadModalField,
    PermissionsField
 } from "../ModalFields";

import { useState,useEffect } from "react";
interface CreateModalInterface {
    context: {
        rows: any[],
        pagina: number,
        cantidad: number,
        itemCounts: number
    },
    actions: any,
    setCreateState: React.Dispatch<React.SetStateAction<boolean>>,
    createState: boolean,
    dataStructure: Object,
    postMethod : (newData: Object, files?:Object) => any   
}
export const CreateModal: React.FC<CreateModalInterface> = ({ actions, setCreateState, createState, dataStructure,postMethod }) => {
    const [formData, setFormData] = useState<any>({});
    const [showForm, setShowForm] = useState<any>({})
    const [password,setPassword] =useState<string>("");
    const [error,setError] = useState<boolean>(false)
    const [errorMsg,setErrorMsg] = useState<string>("")
    const [isLoading,setIsLoading] = useState<boolean>(false);


    const [toast,setToast] = useState<boolean>(false)
    const [toastType,setToastType] = useState<string>("");
    const [toastStateMsg,setToastStateMsg] = useState<string>("")
    const [resultMsg,setResultMsg] = useState("");
    const LoadingModalContent = () => {
        if (isLoading === true) {
          return <LoadingModal 
                    show={isLoading} 
                    headerLabel="Creando Documento"
                    bodyLabel=" Creando ...."
                />;
        }
      };
    const handleTextChange = ( event : string,keyName : string) =>{
        setFormData((prevData: any) =>({
            ...prevData,
            [keyName]: event, 
        })
        )
    }
    const handleCheckBox = (keyName: string,checkBoxKeyName:string,value:boolean) =>{
        setFormData((prevData : any) =>({
            ...prevData,
            [keyName]: { ...formData[keyName],[checkBoxKeyName] : !value }, 
        }))
    }
    const handleDocumentChange = ( event : any ,keyName : string ) =>{
        setFormData((prevData: any) =>({
            ...prevData,
            [keyName]: event, 
        }))
    }
    const handleDropDownChange = ( event : string,keyName : string,id?: string) =>{
        if (!id){
            setFormData((prevData : any ) =>({
                ...prevData,
                [keyName]: event, 
            }))
            setShowForm((prevData :any) =>({
                ...prevData,
                [keyName]: event, 
            }))
        }else{
            setFormData((prevData: any) =>({
                ...prevData,
                [keyName]: id, 
            }))
            setShowForm((prevData: any) =>({
                ...prevData,
                [keyName]: event, 
            }))
        }
    }
    const refreshForm = () =>{
        const initialData: Record<string, any> = {}; 
        Object.values(dataStructure).forEach((key: { keyName: string, type: string }) => {
            switch (key.type) {
                case "list":
                case "selectable-list-text":
                case "selectable-fetched-list-text":
                    initialData[key.keyName] = [];
                    break;
                case "text":
                case "large-text":
                case "selectable-text":
                case "selectable-fetched-text":
                    initialData[key.keyName] = "";
                    break;
                case "date":
                    initialData[key.keyName] = "";
                    break;
                case "images":
                case "document":
                    initialData[key.keyName] = "";
                    break;
                case "permissions":
                    initialData[key.keyName] = {
                        colaboradores : false,
                        control_biologico : false,
                        enfermedades : false,
                        estudiantes : false,
                        miembros : false,
                        noticias : false,
                        proyectos : false,
                        servicios : false,
                        tesis : false,
                        rol : false,
                    };
                    break;
                case "general-permissions":
                    initialData[key.keyName] = {
                        create : false,
                        update : false,
                        delete : false,
                    };
                    break;
                case "null":
                    break;
                default:    
                    break;
            }
        });
        return initialData
    }
    const removeTags = (indexToRemove: number, keyName: string) => {
        setFormData((prevData: Record<string, any>) => ({
          ...prevData,
          [keyName]: (prevData[keyName] as any[]).filter((_, index) => index !== indexToRemove),
        }));
        setShowForm((prevData: Record<string, any>) => ({
            ...prevData,
            [keyName]: (prevData[keyName] as any[]).filter((_, index) => index !== indexToRemove),
          }));
      };
      const addTags = (event: string, keyName: string, id?: string, ActionEvent?: any) => {
        if (event !== "" && (!formData[keyName]?.includes(event) && !formData[keyName]?.includes(id))) {
          setFormData((prevData: Record<string, any>) => {
            const newData = { ...prevData };
            const currentTags = newData[keyName] || [];
            newData[keyName] = [...currentTags, id];
            return newData;
          });
          setShowForm((prevData: Record<string, any>) => {
            const newData = { ...prevData };
            const currentTags = newData[keyName] || [];
            if (!currentTags.includes(event)) {
              newData[keyName] = [...currentTags, event];
            }
            return newData;
          });
          if (ActionEvent) {
            ActionEvent.target.value = "";
          }
        }
      }
    const handleClose = () => {
        const refreshedData = refreshForm();
        setFormData(refreshedData);
        setShowForm(refreshedData);
        setPassword("");
        setCreateState(false);
    };
    const submit = async () => {
        if (formData["contrasena"] && formData["contrasena"] !== password) {
          setErrorMsg("Las Contraseñas no coinciden.");
          setError(true);
          return;
        }
        setError(false);
        setErrorMsg("");
        const archivos: Record<string, File> = {};
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            const value = formData[key];
            if (value instanceof File) {
              archivos[key] = value;
            }
          }
        }
        handleClose();
        setIsLoading(true);
        const timeoutMilliseconds = 120000; 
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
          setToastStateMsg("No se ha podido insertar el documento!")
          setResultMsg("Se ha agotado el tiempo!")
          setToastType("failure");
          setToast(true)
        }, timeoutMilliseconds);
    
        const success = await postMethod(formData, { archivos: archivos });
    
        clearTimeout(timeoutId);
    
        if (!success.error) {
            actions({
                type: "CREATE_ITEM",
                newData: success,
            });
            setToastStateMsg("Se ha creado el documento con éxito!")
            setResultMsg("Se ha Creado el documento con éxito!")
            setToastType("success");
            setToast(true)
            setIsLoading(false);
            const refreshedData = refreshForm();
            setFormData(refreshedData);
            return;
        } else {
            setIsLoading(false);
            setToastStateMsg("No se ha podido insertar el documento!")
            setResultMsg(success.error)
            setToastType("failure");
            setToast(true)
            return
        }

      };
    useEffect(() => {
        setFormData(refreshForm());
      }, []);
    return (
        <>
        <Modal
            show={createState}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            className="custom-modal"
        >   
            <Modal.Header 
                className="modal-header"
                >
                <Modal.Title>
                    Nuevo Objeto
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-content">
                <Form className="create-form">
                <Form.Group className="create-form-group">
                    {Object.values(dataStructure).map((key, index) => (
                    <div key={index} className="form-field">
                        {
                            key.editable && (key.type === "permissions" || key.type === "general-permissions") && (
                                <PermissionsField 
                                    label={key.name}
                                    value={formData[key.keyName]}
                                    onChange= {(event,value)=>handleCheckBox( key.keyName,event,value)}
                                />
                            )
                        }
                        { 
                            key.editable && key.type === "text" && 
                                <TextModalField
                                    label={key.name}
                                    placeholder={`Ingrese ${key.name}`}
                                    value={formData[key.keyName]}
                                    onChange={(value) => handleTextChange(value, key.keyName)}
                                />
                        }
                        { 
                            key.editable && key.type === "large-text" && 
                                <LargeTextModalField
                                    label={key.name}
                                    placeholder={`Ingrese ${key.name}`}
                                    value={formData[key.keyName]}
                                    onChange={(value) => handleTextChange(value, key.keyName)}
                                />
                        }
                        { 
                            key.editable && key.type === "document" && 
                                <DocumentModalField 
                                    label={key.name}
                                    keyName={key.keyName}
                                    formData={formData}
                                    onChange={(item) => handleDocumentChange(item,key.keyName)}
                                /> 
                        } 
                        { 
                            key.editable && key.type === "date" && 
                                <DateModalField 
                                    label={key.name}
                                    value={formData[key.keyName]}
                                    onChange={(value) => handleTextChange(value, key.keyName)}
                                />
                        }
                        { 
                            key.editable && key.type === "list" && (
                                <ListModalField
                                    label={key.name}
                                    placeholder={`Presione enter para agregar ${key.name.toLowerCase()}`}
                                    items={formData[key.keyName] || []}
                                    onAddItem={(item,event) => addTags(item, key.keyName, item,event)}
                                    onRemoveItem={(index) => removeTags(index, key.keyName)}
                                />
                        )}
                        { 
                            key.editable && key.type === "single-image" && 
                                <SingleImageUploadModalField
                                    label = {key.name}
                                    onChange={(item) => handleDocumentChange(item,key.keyName)}
                                    keyName={key.keyName}
                                    formData={formData}
                                />
                        }
                        { 
                            key.editable && key.type === "password" && 
                                <PasswordModalField
                                    label={key.name}
                                    placeholder={`Ingrese ${key.name}`}
                                    value={formData[key.keyName]}
                                    password = {password}
                                    onChange={(value) => handleTextChange(value, key.keyName)}
                                    setPassword={setPassword}
                                />  
                        }
                        {
                            key.editable && (key.type === "selectable-text" || key.type === "selectable-fetched-text" ) && (
                                <DropdownModalField
                                    label={key.name}
                                    choices={key.choices}
                                    choices_id={key.choices_id}
                                    selectedValue={showForm[key.keyName]}
                                    onSelect={(value,index?) => key.type === "selectable-text" ? handleDropDownChange(value, key.keyName) : handleDropDownChange(value, key.keyName, index)}
                                />
                            )
                        }       
                        {
                            key.editable && (key.type === "selectable-list-text" || key.type === "selectable-fetched-list-text") && (
                                <SelectableListTextField
                                    label={key.name}
                                    keyName={key.keyName}
                                    choices={key.choices}
                                    selectedValue={showForm[key.keyName]}
                                    onSelect={(value, keyName, index) => addTags(value, keyName, key.choices_id[index])}
                                    onRemove={(index) => removeTags(index, key.keyName)}
                                    showForm={showForm}
                                />
                            )
                        }    
                        {
                            key.editable && (key.type === "multiple-images") && (
                                <MultiImageUploadModalField
                                    label = {key.name}
                                    keyName= {key.keyName}
                                    formData= {FormData}
                                    onChange={(item) => handleDocumentChange(item,key.keyName)}
                                />
                        )
                        }
                           
                    </div>
                    ))}
                    {
                        error && 
                        <Form.Label style={{"color":"red"}}>
                            {errorMsg}
                        </Form.Label>
                    }

                </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="modal-footer">
                <Button variant="secondary" onClick={ submit }>
                    Crear
                </Button>
                <Button variant="secondary" onClick={ handleClose }>
                    Cerrar
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
    );
}
