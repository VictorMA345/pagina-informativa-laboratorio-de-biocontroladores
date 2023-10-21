import { Proyecto } from "../Models";
import { jsonToFormData } from ".";

export const getAllProyectos = async (
  pageNumber: number, 
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<Proyecto[]> => {
    let apiUrl = `http://localhost:3000/api/proyectos?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
    const data: Proyecto[] = await response.json();
    return data;
};

export const postProyecto = async (newProyecto: Proyecto): Promise<Proyecto> => {
  try {
    const formData = jsonToFormData(newProyecto);
    const response = await fetch("http://localhost:3000/api/proyectos", {
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

export const deleteProyecto = async (id: string): Promise<Proyecto> => {
  try {
    const response = await fetch(`http://localhost:3000/api/proyectos/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const updateProyecto = async (id: string, updatedData: Proyecto): Promise<Proyecto | undefined> => {
  if (id !== "") {
    try {
      const formData = jsonToFormData(updatedData);
      const response = await fetch(`http://localhost:3000/api/proyectos/${id}`, {
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

export const getProyecto = async (id: string): Promise<Proyecto | undefined> => {
  if (id !== "") {
    const response = await fetch(`http://localhost:3000/api/proyectos/${id}`);
    const data = await response.json();
    return data;
  } else {
    return undefined;
  }
};

interface ProyectoName {
    id: string;
    nombre: string;
  }
export const getAllProyectoNames = async (): Promise<ProyectoName[]> => {
    const apiUrl = "http://localhost:3000/api/names/proyectos"; 
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          return [];
        }
        const data: ProyectoName[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};