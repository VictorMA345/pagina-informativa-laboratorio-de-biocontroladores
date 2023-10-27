import { Enfermedad } from "../Models";
interface EnfermedadServices {
  data : Enfermedad[]
  itemCounts: Number
}
export const getAllEnfermedad = async (
  pageNumber:Number,
  selectedPage:Number,
  search?: string,
  searchFor?: string,
  order?: string): Promise<EnfermedadServices> => 
  {
    let apiUrl = `http://localhost:3000/api/enfermedades?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
      const data: EnfermedadServices = await response.json(); 
      return data;
  };