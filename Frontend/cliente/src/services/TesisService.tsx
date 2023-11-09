import { Tesis } from "../Models"; 

interface DataType {
  data: Tesis[];
  itemCounts: number;
}

export const getAllTesis = async (
  pageNumber: number, 
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string,
  startDate?: string,
  endDate?: string) => {
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
    if (startDate) {
      apiUrl += `&startDate=${encodeURIComponent(startDate)}`;
    }
    if (endDate) {
      apiUrl += `&endDate=${encodeURIComponent(endDate)}`;
    }
    const response = await fetch(apiUrl);
    const data: DataType = await response.json();
    return data;
};
export const getTesis = async (id: string) => {
    if (id !== "") {
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/tesis/${id}`);
      const data = await response.json();
      return data;
    } else {
      return undefined;
    }
  };