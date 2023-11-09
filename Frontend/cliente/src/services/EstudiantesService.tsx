import { Estudiante } from "../Models";

interface EstudianteServices {
  data: Estudiante[];
  itemCounts: Number;
}

export const getAllEstudiantes = async (
  pageNumber: Number, 
  selectedPage: Number,
  search?: string,
  searchFor?: string,
  order?: string,
  startDate?: string,
  endDate?: string): Promise<EstudianteServices> => {
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
  const data: EstudianteServices = await response.json();
  return data;
};

export const getEstudiante = async (id: string) => {
  if (id !== "") {
    const response = await fetch(`http://localhost:3000/api/estudiantes/${id}`);
    const data = await response.json();
    return data;
  }
};

