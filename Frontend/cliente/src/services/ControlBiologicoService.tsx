import { ControlBiologico } from "../Models";
interface ControlBiologicoServices {
    data: ControlBiologico[];
    itemCounts: number;
  }
  
export const getAllControlBiologico = async (
    pageNumber: number,
    selectedPage: number,
    search?: string,
    searchFor?: string,
    order?: string,
    startDate?: string,
    endDate?: string
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
      if (startDate) {
        apiUrl += `&startDate=${encodeURIComponent(startDate)}`;
      }
      if (endDate) {
        apiUrl += `&endDate=${encodeURIComponent(endDate)}`;
      }
      const response = await fetch(apiUrl);
  
      const data: ControlBiologicoServices = await response.json();
      return data;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  };
  export const getControlBiologico = async (id: string) => {
    if (id !== "") {
      const response = await fetch(`http://localhost:3000/api/control_biologico/${id}`);
      const data = await response.json();
      return data;
    }
  };
  