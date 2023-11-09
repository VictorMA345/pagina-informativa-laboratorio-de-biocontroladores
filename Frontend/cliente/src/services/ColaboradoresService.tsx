import { Colaborador } from "../Models";

interface ColaboradorServices {
  data : Colaborador[]
  itemCounts: Number
}
export const getAllColaboradores = async (
  pageNumber: number,
  selectedpage: number,
  search?: string,
  searchFor?: string,
  order?: string,
  startDate?: string,
  endDate?: string
): Promise<ColaboradorServices> => {
  try {
  let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/colaboradores?pagina=${selectedpage}&cantidad=${pageNumber}`;
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

  const data: ColaboradorServices = await response.json();
  return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};


export const getColaborador = async (id: string) => {
    if (id !== "") {
        const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/colaboradores/${id}`);

        const data = await response.json();
        return data;
    }
};