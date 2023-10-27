import "./EditModal.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState,useEffect } from "react";
import { LoadingModal,NotificationToast } from "..";
import { 
  TextModalField,
  LargeTextModalField,
  DocumentModalField,
  DateModalField,
  ListModalField,
  SingleImageUploadModalField,
  DropdownModalField,
  SelectableListTextField,
  MultiImageUploadModalField,
  PermissionsField
} from "../ModalFields";
interface EditModalInterface {
    actions: any,
    setEditModal: React.Dispatch<React.SetStateAction<boolean>>,
    openEditModal: boolean,
    id : string,
    getMethod: (id:string) => any,
    dataStructure: Object
    updateMethod : (id: string,body: any ) => any
}
export const EditModal : React.FC<EditModalInterface> = ({actions,openEditModal,setEditModal,id,getMethod,updateMethod,dataStructure}) => {
    const [selectedItem, setSelectedItem] = useState<any>(undefined)
    const [showForm, setShowForm] = useState<any>({})
    
    const [originalItem,setOriginalItem] = useState<any>(undefined)
    const [isLoading,setIsLoading] = useState<boolean>(false);


    const [toast,setToast] = useState<boolean>(false)
    const [toastType,setToastType] = useState<string>("");
    const [toastStateMsg,setToastStateMsg] = useState<string>("")
    const [resultMsg,setResultMsg] = useState("");
    const LoadingModalContent = () => {
        if (isLoading === true) {
          return <LoadingModal 
                    show={isLoading} 
                    headerLabel="Editando Documento"
                    bodyLabel=" Editando ...."
                />;
        } else {  
          return (
            null
          );
        }
      };
    const removeTags = (indexToRemove: number, keyName: string) => {
        setSelectedItem((prevData: Record<string, any>) => ({
          ...prevData,
          [keyName]: (prevData[keyName] as any[]).filter((_, index) => index !== indexToRemove),
        }));
        setShowForm((prevData: Record<string, any>) => ({
          ...prevData,
          [keyName]: prevData[keyName] ? (prevData[keyName] as any[]).filter((_, index) => index !== indexToRemove) : [],
        }));
      };
      const handleTextChange = ( event : string,keyName : string) =>{
        setSelectedItem((prevData: Record<string, any>) =>({
        ...prevData,
        [keyName]: event, 
        })
        )
    }
    const handleCheckBox = (keyName: string,checkBoxKeyName:string,value:boolean) =>{
        setSelectedItem((prevData: Record<string, any>) =>({
            ...prevData,
            [keyName]: { ...selectedItem[keyName],[checkBoxKeyName] : !value }, 
        }))
    }
    const handleDropDownChange = ( event : string,keyName : string,id?: string) =>{
        if (!id){
            setSelectedItem((prevData: Record<string, any>) =>({
                ...prevData,
                [keyName]: event, 
            }))
            setShowForm((prevData: Record<string, any>) =>({
                ...prevData,
                [keyName]: event, 
            }))
        }else{
            setSelectedItem((prevData: Record<string, any>) =>({
                ...prevData,
                [keyName]: id, 
            }))
            setShowForm((prevData : Record<string, any>) =>({
                ...prevData,
                [keyName]: event, 
            }))
        }
    }
    const handleDocumentChange = ( event : any ,keyName : string ) =>{
          setSelectedItem((prevData : Record<string, any>) =>({
                  ...prevData,
                    [keyName]: event, 
                }))
      }    
      const addTags = (event: string, keyName: string, id?: string, ActionEvent?: React.KeyboardEvent<HTMLInputElement>) => {
        if (event !== "" && (!selectedItem[keyName]?.includes(event) && !selectedItem[keyName]?.includes(id))) {
          setSelectedItem((prevData: Record<string, any>) => {
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

    const handleClose = () =>{
      setShowForm({});
      setSelectedItem(originalItem);
      setEditModal(!openEditModal)  
    }
    useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await getMethod(id); 
            setSelectedItem(data);
            setOriginalItem(data);
            Object.values(dataStructure).map((value) =>{
              if (value.choices_id && value.choices && Array.isArray(data[value.keyName])){
                value.choices_id.map((item,index) =>{
                  data[value.keyName].map((itemData) =>{
                      if(itemData === item ){
                        setShowForm((prevData: Record<string, any>) => {
                          const newData = { ...prevData };
                          const currentList : String[] =  newData[value.keyName] || [];
                          newData[value.keyName] = [...currentList, value.choices[index]];
                          return newData;
                        });
                      }
                  })
                })
              }
              else if (value.choices && !value.choices_id && !Array.isArray(data[value.keyName])) {
                setShowForm({...showForm, 
                          [value.keyName] : data[value.keyName]
                })
              } else if (value.choices && value.choices_id && !Array.isArray(data[value.keyName])) {
                value.choices_id.forEach((item, index) => {
                  if (data[value.keyName] === item) {
                    setShowForm((prevData) => ({
                      ...prevData,
                      [value.keyName]: value.choices[index],
                    }));
                  }
                });
              }
              else {
                return null;
              } 
            })
          } catch (error) { 
            console.log(error);
          }
        }
        setShowForm({});
        fetchData();
      }, [id,openEditModal]);
      const EditObject = async () => {
        setIsLoading(true);
        handleClose();
        const timeoutMilliseconds = 120000;  
        const timeoutId = setTimeout(() => {
          setIsLoading(false);
          setToastStateMsg("No se ha podido editar el documento!")
          setResultMsg("Se ha agotado el tiempo!")
          setToastType("failure");
          setToast(true)
        }, timeoutMilliseconds);
        const success = await updateMethod(id, selectedItem);
        clearTimeout(timeoutId);
        if (!success.error) {
          actions({
            type: "UPDATE_ITEM",
            id: id,
            updateData: success,
          });
          setToastStateMsg("Se ha editado el documento con éxito!")
          setResultMsg("Se ha editado el documento con éxito!")
          setToastType("success");
          setToast(true)
          setIsLoading(false);
        } else {
          setSelectedItem(originalItem)
          setIsLoading(false);
          setToastStateMsg("No se ha podido editar el documento!")
          setResultMsg(success.error)
          setToastType("failure");
          setToast(true)
        }
        setIsLoading(false);
      };
    return (
        <>
            <Modal className='edit-modal' show={openEditModal} onHide={handleClose}>
                <Modal.Header className='edit-modal-header'>
                    <Modal.Title>
                        Editar
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='edit-modal-body'>
                {
                Object.values(dataStructure).map((key, index) => (
                    <div key={index} className="form-field">  
                        { selectedItem && key.editable && key.type === "text" &&
                              <TextModalField
                                  label={key.name}
                                  placeholder={`Ingrese ${key.name}`}
                                  value={selectedItem && selectedItem[key.keyName]}
                                  onChange={(e) => handleTextChange(e,key.keyName)}
                              />
                        }
                        { selectedItem && key.editable && key.type === "large-text" && 
                              <LargeTextModalField
                                label={key.name}
                                placeholder={`Ingrese ${key.name}`}
                                value={selectedItem[key.keyName]} 
                                onChange={(e) => handleTextChange(e,key.keyName)}
                                />
                        }
                        { selectedItem && key.editable && key.type === "document" && 
                              <DocumentModalField 
                                label={key.name}
                                keyName={key.keyName}
                                formData={selectedItem}
                                onChange={(item) => handleDocumentChange(item,key.keyName)}
                              /> 
                        } 
                        { selectedItem && key.editable && key.type === "date" && 
                              <DateModalField 
                                label={key.name}
                                value={selectedItem[key.keyName]}
                                onChange={(value) => handleTextChange(value, key.keyName)}
                              />
                        } 
                        { selectedItem && key.editable && key.type === "list" && (
                              <ListModalField
                                label={key.name}
                                placeholder={`Presione enter para agregar ${key.name.toLowerCase()}`}
                                items={selectedItem[key.keyName] || []}
                                onAddItem={(item,event) => addTags(item, key.keyName, item ,event)}
                                onRemoveItem={(index) => removeTags(index, key.keyName)}
                              />
                            )
                        }
                        { selectedItem && key.editable && key.type === "single-image" && 
                              <SingleImageUploadModalField
                                  label = {key.name}
                                  onChange={(item) => handleDocumentChange(item,key.keyName)}
                                  keyName={key.keyName}
                                  formData={selectedItem && selectedItem}
                              />
                        } 
                        {
                            key.editable && (key.type === "selectable-text" || key.type === "selectable-fetched-text" ) && (
                                <>
                                    <DropdownModalField
                                        label={key.name}
                                        choices={key.choices}
                                        choices_id={key.choices_id}
                                        selectedValue={showForm[key.keyName]}
                                        onSelect={(value,index?) => key.type === "selectable-text" ? handleDropDownChange(value, key.keyName) : handleDropDownChange(value, key.keyName, index)}
                                    />
                                </>
                            )
                        }       
                        {key.editable && (key.type === "selectable-list-text" || key.type === "selectable-fetched-list-text") && (
                            <SelectableListTextField
                                label = {key.name}
                                keyName = {key.keyName}
                                choices = {key.choices}
                                selectedValue={showForm[key.keyName]}
                                onSelect={(value, keyName, index) => addTags(value, keyName, key.choices_id[index])}
                                onRemove={(index) => removeTags(index, key.keyName)}
                                showForm={showForm}
                            />
                        )
                        }
                        
                        {key.editable && key.type === "multiple-images" && (
                            <MultiImageUploadModalField
                              label = {key.name}
                              onChange={(item) => handleDocumentChange(item,key.keyName)}
                              keyName={key.keyName}
                              formData={selectedItem && selectedItem}
                            />
                        )
                        }
                        {
                            selectedItem && key.editable && (key.type === "permissions" || key.type === "general-permissions") && (
                                <PermissionsField 
                                    label={key.name}
                                    value={ selectedItem[key.keyName]}
                                    onChange= {(event,value)=>handleCheckBox( key.keyName,event,value)}
                                />
                            )
                        }
                    </div>)
                    )
                }
                </Modal.Body>
                <Modal.Footer className='edit-modal-footer'>
                    <Button variant="secondary" onClick={EditObject}>
                        Si
                    </Button>   
                    <Button variant="secondary" onClick={handleClose}>
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
