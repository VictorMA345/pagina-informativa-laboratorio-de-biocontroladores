import { Tesis } from "../Models"; 
export const getAllTesis = async (
  pageNumber: number, 
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<Tesis[]> => {
    let apiUrl = `http://localhost:3000/api/tesis?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
export const getTesis = async (id: string): Promise<Tesis | undefined> => {
    if (id !== "") {
      const response = await fetch(`http://localhost:3000/api/tesis/${id}`);
      const data = await response.json();
      return data;
    } else {
      return undefined;
    }
  };