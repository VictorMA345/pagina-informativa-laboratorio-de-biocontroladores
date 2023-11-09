import { Noticia } from "../Models";
import { jsonToFormData } from ".";

export const getAllNoticias = async (  
  pageNumber?:Number,
  selectedPage?:Number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<Noticia[]> => {
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
    const response = await fetch(apiUrl);

    const data: Noticia[] = await response.json();
    return data;
  };

export const postNoticia = async (newNoticia: Noticia): Promise<Noticia> => {
  try {
    const formData = jsonToFormData(newNoticia);
    const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/noticias", {
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

export const deleteNoticia = async (id: string): Promise<Noticia> => {
  try {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/noticias/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const updateNoticia = async (id: string, updatedData: Noticia): Promise<Noticia | undefined> => {
  if (id !== "") {
    try {
      const formData = jsonToFormData(updatedData);
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/noticias/${id}`, {
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

export const getNoticia = async (id: string): Promise<Noticia | undefined> => {
  if (id !== "") {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/noticias/${id}`);

    const data = await response.json();
    return data;
  } else {
    return undefined;
  }
};

interface NoticiaName {
  _id: string;
  titulo: string;
}

export const getAllNoticiaNames = async (): Promise<NoticiaName[]> => {
  const apiUrl = "https://laboratorio-biocontroladores.onrender.com/api/names/noticias"; // Reemplaza con la URL de tu API
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return [];
    }
    const data: NoticiaName[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};
