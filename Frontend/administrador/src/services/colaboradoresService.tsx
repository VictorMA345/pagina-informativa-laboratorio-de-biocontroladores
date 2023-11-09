import { Colaborador } from "../Models";
import { jsonToFormData } from ".";

interface ColaboradorServices {
  data : Colaborador[]
  itemCounts: Number
}
export const getAllColaboradores = async (
  pageNumber: number,
  selectedpage: number,
  search?: string,
  searchFor?: string,
  order?: string
): Promise<ColaboradorServices> => {
  try {
  let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/colaboradores?pagina=${selectedpage}&cantidad=${pageNumber}`;
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

  const data: ColaboradorServices = await response.json();
  return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

  export const postColaborador = async (newColaborador: Colaborador): Promise<Colaborador> => {
    try {
      const formData = jsonToFormData(newColaborador);
      const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/colaboradores", {
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
  
  export const deleteColaborador = async (id: string): Promise<Colaborador> => {
    try {
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/colaboradores/${id}`, {
        method: 'DELETE',
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  };
  
  export const updateColaborador = async (id: string, updatedData: Colaborador): Promise<Colaborador | undefined> => {
    if (id !== "") {
      try {
        const formData = jsonToFormData(updatedData);
        const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/colaboradores/${id}`, {
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
  
  export const getColaborador = async (id: string) => {
    if (id !== "") {
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/colaboradores/${id}`);

      const data = await response.json();
      return data;
    }
  };