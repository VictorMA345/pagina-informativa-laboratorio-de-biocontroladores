import { Estudiante } from "../Models";
import { jsonToFormData } from ".";

interface EstudianteServices {
  data: Estudiante[];
  itemCounts: Number;
}

export const getAllEstudiantes = async (
  pageNumber: Number, 
  selectedPage: Number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<EstudianteServices> => {
  let apiUrl = `http://localhost:3000/api/estudiantes?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
  const data: EstudianteServices = await response.json();
  return data;
};

export const postEstudiante = async (newEstudiante: Estudiante): Promise<Estudiante> => {
  try {
    const formData = jsonToFormData(newEstudiante);
    const response = await fetch("http://localhost:3000/api/estudiantes", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      console.log("Error a la hora de insertar el estudiante");
    }
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const deleteEstudiante = async (id: string): Promise<Estudiante> => {
  try {
    const response = await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const updateEstudiante = async (id: string, updatedData: Estudiante): Promise<Estudiante | undefined> => {
  if (id !== "") {
    try {
      const formData = jsonToFormData(updatedData);
      const response = await fetch(`http://localhost:3000/api/estudiantes/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        console.log("Error a la hora de actualizar el estudiante");
      }

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

export const getEstudiante = async (id: string) => {
  if (id !== "") {
    const response = await fetch(`http://localhost:3000/api/estudiantes/${id}`);

    const data = await response.json();
    return data;
  }
};

interface EstudianteName {
  id: string;
  nombre: string;
}

export const getAllEstudiantesNames = async (): Promise<EstudianteName[]> => {
  const apiUrl = "http://localhost:3000/api/names/estudiantes"; // Reemplaza con la URL de tu API
  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return [];
    }
    const data: EstudianteName[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};