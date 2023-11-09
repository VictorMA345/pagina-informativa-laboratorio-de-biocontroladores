import { Miembro } from "../Models";
import { jsonToFormData } from ".";
interface MiembroServices {
    data : Miembro[]
    itemCounts: Number
  }


export const getAllMiembros = async (
  pageNumber?:Number,
  selectedPage?:Number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<MiembroServices> => {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/miembros?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
    const data: MiembroServices = await response.json(); 
    return data;
};  

export const postMiembro = async (newMiembro: Miembro): Promise<Miembro> => {
  try {
    const formData = jsonToFormData(newMiembro)
    const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/miembros/signup", {
      method: "POST",
      body: formData,
    });

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
export const deleteMiembro = async(id : string) : Promise<Miembro> =>{
    try{
        const response =await fetch("https://laboratorio-biocontroladores.onrender.com/api/miembros/" + id,{
        method: 'DELETE'
        });
        if (!response.ok){
          console.log("error a la hora de eliminar el miembro")
        } 
        const json = await response.json();
        return json;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}
export const updateMiembro = async (id: string, updatedData: Miembro): Promise<Miembro | undefined> => {
  if (id !== "") {
    try {
      const formData = jsonToFormData(updatedData);
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/miembros/${id}`, {
        method: "PATCH",
        body: formData,
      });
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.log(error);
      throw error;
    }
  } else {
    return undefined;
  }
};

export const getMiembro = async(id:string) =>{
    if( id !== ""){
        const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/miembros/"+id)
        const data = await response.json(); 
        return data;
    }
}

interface MiembroName {
  id: string;
  nombre: string;
}

export const getAllMiembrosNames = async (): Promise<MiembroName[]> => {
  const apiUrl = "https://laboratorio-biocontroladores.onrender.com/api/names/miembros"; // Reemplaza con la URL de tu API
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return [];
    }
    const data: MiembroName[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};