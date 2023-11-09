import { Noticia } from "../Models";

export const getAllNoticias = async (  
  pageNumber?:Number,
  selectedPage?:Number,
  search?: string,
  searchFor?: string,
  order?: string,
  startDate?: string,
  endDate?: string): Promise<Noticia[]> => {
    let apiUrl = `http://localhost:3000/api/noticias?pagina=${selectedPage}&cantidad=${pageNumber}`;
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

    const data: Noticia[] = await response.json();
    return data;
  };

export const getNoticia = async (id: string): Promise<Noticia | undefined> => {
  if (id !== "") {
    const response = await fetch(`http://localhost:3000/api/noticias/${id}`);

    const data = await response.json();
    return data;
  } else {
    return undefined;
  }
};

