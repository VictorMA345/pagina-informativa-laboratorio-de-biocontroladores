import { ControlBiologico } from "../Models";
import { jsonToFormData } from ".";

interface ControlBiologicoServices {
  data: ControlBiologico[];
  itemCounts: number;
}

export const getAllControlBiologico = async (
  pageNumber: number,
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string
): Promise<ControlBiologicoServices> => {
  try {
    let apiUrl = `http://localhost:3000/api/control_biologico?pagina=${selectedPage}&cantidad=${pageNumber}`;
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

    const data: ControlBiologicoServices = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const postControlBiologico = async (
  newControlBiologico: ControlBiologico
): Promise<ControlBiologico> => {
  try {
    const formData = jsonToFormData(newControlBiologico);
    const response = await fetch("http://localhost:3000/api/control_biologico", {
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

export const deleteControlBiologico = async (id: string): Promise<ControlBiologico> => {
  try {
    const response = await fetch(`http://localhost:3000/api/control_biologico/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const updateControlBiologico = async (
  id: string,
  updatedData: ControlBiologico
): Promise<ControlBiologico | undefined> => {
  if (id !== "") {
    try {
      const formData = jsonToFormData(updatedData);
      const response = await fetch(`http://localhost:3000/api/control_biologico/${id}`, {
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

export const getControlBiologico = async (id: string) => {
  if (id !== "") {
    const response = await fetch(`http://localhost:3000/api/control_biologico/${id}`);
    const data = await response.json();
    return data;
  }
};
