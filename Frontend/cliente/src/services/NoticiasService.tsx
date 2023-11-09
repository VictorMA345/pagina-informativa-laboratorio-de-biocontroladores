import { Noticia } from "../Models";

interface DataType {
  data: Noticia[];
  itemCounts: number;
}

export const getAllNoticias = async (  
  pageNumber?:Number,
  selectedPage?:Number,
  search?: string,
  searchFor?: string,
  order?: string,
  startDate?: string,
  endDate?: string) => {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/noticias?pagina=${selectedPage}&cantidad=${pageNumber}`;
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

export const getNoticia = async (id: string) => {
  if (id !== "") {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/noticias/${id}`);

    const data = await response.json();
    return data;
  } else {
    return undefined;
  }
};

