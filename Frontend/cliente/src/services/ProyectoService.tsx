import { Proyecto } from "../Models";

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

export const getProyecto = async (id: string): Promise<Proyecto | undefined> => {
  if (id !== "") {
    const response = await fetch(`http://localhost:3000/api/proyectos/${id}`);
    const data = await response.json();
    return data;
  } else {
    return undefined;
  }
};
