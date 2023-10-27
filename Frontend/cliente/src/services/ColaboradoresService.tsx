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
  order?: string
): Promise<ColaboradorServices> => {
  try {
  let apiUrl = `http://localhost:3000/api/colaboradores?pagina=${selectedpage}&cantidad=${pageNumber}`;
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

  const data: ColaboradorServices = await response.json();
  return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};


export const getColaborador = async (id: string) => {
    if (id !== "") {
        const response = await fetch(`http://localhost:3000/api/colaboradores/${id}`);

        const data = await response.json();
        return data;
    }
};