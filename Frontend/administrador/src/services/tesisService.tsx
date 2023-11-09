import { Tesis } from "../Models"; 
import { jsonToFormData } from ".";

export const getAllTesis = async (
  pageNumber: number, 
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<Tesis[]> => {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/tesis?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
    const data: Tesis[] = await response.json();
    return data;
};

export const postTesis = async (newTesis: Tesis): Promise<Tesis> => {
  try {
    const formData = jsonToFormData(newTesis);
    const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/tesis", {
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

export const deleteTesis = async (id: string): Promise<Tesis> => {
  try {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/tesis/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const updateTesis = async (id: string, updatedData: Tesis): Promise<Tesis | undefined> => {
  if (id !== "") {
    try {
      const formData = jsonToFormData(updatedData);
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/tesis/${id}`, {
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

export const getTesis = async (id: string): Promise<Tesis | undefined> => {
  if (id !== "") {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/tesis/${id}`);
    const data = await response.json();
    return data;
  } else {
    return undefined;
  }
};

interface TesisName {
  _id: string;
  tituloTesis: string;
}

export const getAllTesisNames = async (): Promise<TesisName[]> => {
  const apiUrl = "https://laboratorio-biocontroladores.onrender.com/api/names/tesis"; // Reemplaza con la URL de tu API
  try {
    const response = await fetch(apiUrl);
    const data: TesisName[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
