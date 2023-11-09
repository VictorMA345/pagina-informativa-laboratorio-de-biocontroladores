import { Servicio } from "../Models";
import { jsonToFormData } from ".";

interface ServicioServices {
  data: Servicio[];
  itemCounts: number;
}

export const getAllServicios = async (
  pageNumber: number, 
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<ServicioServices> => {
  try {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/servicios?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
    const data: ServicioServices = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const postServicio = async (newServicio: Servicio): Promise<Servicio> => {
  try {
    const formData = jsonToFormData(newServicio);

    const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/servicios", {
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

export const deleteServicio = async (id: string): Promise<Servicio> => {
  try {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/servicios/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const updateServicio = async (id: string, updatedData: Servicio): Promise<Servicio | undefined> => {
  if (id !== "") {
    try {
      const formData = jsonToFormData(updatedData);

      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/servicios/${id}`, {
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

export const getServicio = async (id: string) => {
  if (id !== "") {
    try {
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/servicios/${id}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};