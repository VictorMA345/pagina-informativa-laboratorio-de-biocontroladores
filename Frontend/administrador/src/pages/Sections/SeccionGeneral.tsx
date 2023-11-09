import { useState,useEffect } from 'react'
import { Form,Button } from 'react-bootstrap';
import { getGeneralInfo,updateGeneralInfo } from '../../services';
import { NotificationToast } from '../../components';
export const SeccionGeneral = () => {
  const [generalInfo,setGeneralInfo] = useState<any>(undefined);

  const [toast,setToast] = useState<boolean>(false)
  const [toastType,setToastType] = useState<string>("");
  const [toastStateMsg,setToastStateMsg] = useState<string>("")
  const [resultMsg,setResultMsg] = useState("");


  useEffect(() => {
    const fetchInfo = async() =>{
      const info = await getGeneralInfo();
      setGeneralInfo(info[0]);
    }
    fetchInfo();
  }, [])
  
  const submit = async() =>{

    const newData = {
      correo: generalInfo.correo,
      direccion: generalInfo.direccion,
      mision: generalInfo.mision,
      vision: generalInfo.vision,
      telefono: generalInfo.telefono,
      descripcion: generalInfo.descripcion,
      imagenPrincipal: generalInfo.imagenPrincipal
    }
    setToast(true);
    setToastType("success");
    setToastStateMsg("Actualización Existosa");
    setResultMsg("Datos generales de la página actualizados.");
    const updatedData =await updateGeneralInfo(newData);
    if (!updatedData.error){
      setToast(true);
      setToastType("success");
      setToastStateMsg("Actualización Existosa");
      setResultMsg("Datos generales de la página actualizados.");
    } else{
      setToast(true);
      setToastType("failure");
      setToastStateMsg("Error a la hora de actualizar información");
      setResultMsg(updatedData.error);
    }
  }
  const handleChange = (keyName: string, target: string) => {
    setGeneralInfo({ ...generalInfo, [keyName]: target });
  };
  const handleDocumentChange = (keyName: string, target: Object) =>{
    setGeneralInfo({ ...generalInfo, [keyName]: target });
    console.log(generalInfo)
  }
  return (
    <>

    <Form className= "general-config-form" >

      <h1>Información General del Laboratorio  </h1>
      <Form.Group className="mb-3">
        <Form.Label>Dirección del laboratorio</Form.Label>
        <Form.Control 
          value = { generalInfo && generalInfo.direccion }
          type="email" 
          onChange={(e) => handleChange("direccion",e.target.value)}
          />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Teléfono del laboratorio: </Form.Label>
        <Form.Control 
          value={generalInfo && generalInfo.telefono} 
          type="email" 
          onChange={(e) => handleChange("telefono", e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Misión: </Form.Label>
        <Form.Control 
          value = { generalInfo && generalInfo.mision } 
          as="textarea" 
          rows={5} 
          onChange={(e) => handleChange("mision",e.target.value)}
          />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Visión: </Form.Label>
        <Form.Control 
          value = { generalInfo && generalInfo.vision } 
          as="textarea" 
          rows={5} 
          onChange={(e) => handleChange("vision",e.target.value)}
          />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label >Descripción del laboratorio: </Form.Label>
        <Form.Control 
          value = { generalInfo && generalInfo.descripcion } 
          as="textarea" 
          rows={5} 
          onChange={(e) => handleChange("descripcion",e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label >Visitas a la Página: </Form.Label>
        <Form.Label >{generalInfo && generalInfo.visitas} </Form.Label>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label >Imagen Principal del Laboratorio </Form.Label>
        <Form.Control 
          type="file" 
          onChange={(e) => handleDocumentChange("imagenPrincipal",e.target.files[0])}
        />
        {generalInfo && generalInfo.imagenPrincipal && typeof generalInfo.imagenPrincipal !== 'string' && (
          <img
            className="main-client-image"
            src={URL.createObjectURL(generalInfo.imagenPrincipal)}
            alt="Imagen Principal"
          />
        ) || generalInfo && generalInfo.imagenPrincipal && typeof generalInfo.imagenPrincipal === 'string' &&
          <img
            className="main-client-image"
            src={generalInfo.imagenPrincipal && generalInfo.imagenPrincipal}
            alt="Imagen Principal"
          />
        }
      </Form.Group>
      <Button
        onClick={() => submit()}
        className='send-button'
      >
        Actualizar Información
      </Button>
    </Form>
    
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
