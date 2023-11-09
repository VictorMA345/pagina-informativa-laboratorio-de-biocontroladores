import { Proyecto } from "../Models";

interface DataType {
  data: Proyecto[];
  itemCounts: number;
}

export const getAllProyectos = async (
  pageNumber: number, 
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string,
  startDate?: string,
  endDate?: string
  ) => {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/proyectos?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }
    const data: DataType = await response.json();
    return data;
};

export const getProyecto = async (id: string) => {
  if (id !== "") {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/proyectos/${id}`);
    const data = await response.json();
    return data;
  } else {
    return undefined;
  }
};
