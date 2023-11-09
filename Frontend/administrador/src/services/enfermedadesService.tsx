import { Enfermedad } from "../Models";
import { jsonToFormData } from "./logicFunctions"
interface EnfermedadServices {
  data : Enfermedad[]
  itemCounts: Number
}
export const getAllEnfermedad = async (
  pageNumber:Number,
  selectedPage:Number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<EnfermedadServices> => 
  {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/enfermedades?pagina=${selectedPage}&cantidad=${pageNumber}`;
    if (search) {
      apiUrl += `&busqueda=${encodeURIComponent(search)}`;
    }
    if (searchFor) {
      apiUrl += `&clave=${encodeURIComponent(searchFor)}`;
    }
    if (order) {
      apiUrl += `&orden=${encodeURIComponent(order)}`;
    }
    const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }
      const data: EnfermedadServices = await response.json(); 
      return data;
  };
export const postEnfermedad = async (newEnfermedad: Enfermedad) : Promise<Enfermedad>=> {
  try {
    const formData = jsonToFormData(newEnfermedad);
    const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/enfermedades", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      console.log("Error a la hora de insertar la enfermedad");
    }
    const jsonResponse = await response.json();
    return jsonResponse; 
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
export const deleteEnfermedad = async(id : string) : Promise<Enfermedad> =>{
  try{
    const response =await fetch("https://laboratorio-biocontroladores.onrender.com/api/enfermedades/" + id,{
      method: 'DELETE'
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
}


export const updateEnfermedad = async(id:string,body : Enfermedad) : Promise<Enfermedad | undefined>  =>{
  if (id !== ""){
    try {
      const formData = jsonToFormData(body);
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/enfermedades/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!response.ok) {
        console.log("Error a la hora de insertar la enfermedad");
      }
      const jsonResponse = await response.json();
      return jsonResponse; 
    } catch (error) {
      console.log(error)
      throw error
    }
  }else{
    return undefined
  }
}

export const getEnfermedad = async(id:string) =>{
    if( id !== ""){
      const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/enfermedades/"+id)

      const data = await response.json(); 
      return data;
  }
}