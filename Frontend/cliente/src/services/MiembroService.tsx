import { Miembro } from "../Models";
interface MiembroServices {
    data : Miembro[]
    itemCounts: Number
  }
export const getAllMiembros = async (
  pageNumber?:Number,
  selectedPage?:Number,
  search?: string,
  searchFor?: string,
  order?: string,
  startDate?: string,
  endDate?: string): Promise<MiembroServices> => {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/miembros?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
    const data: MiembroServices = await response.json(); 
    return data;
};  

export const getMiembro = async(id:string) =>{
    if( id !== ""){
        const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/miembros/"+id)
        const data = await response.json(); 
        return data;
    }
}


