import { Servicio } from "../Models";
interface ServicioServices {
    data: Servicio[];
    itemCounts: number;
  }

export const getAllServicios = async (
    pageNumber: number, 
    selectedPage: number,
    search?: string,
    searchFor?: string,
    order?: string,
    startDate?: string,
    endDate?: string): Promise<ServicioServices> => {
    try {
        let apiUrl = `http://localhost:3000/api/servicios?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
        const data: ServicioServices = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};
export const getServicio = async (id: string): Promise<Servicio | undefined> => {
if (id !== "") {
    const response = await fetch(`http://localhost:3000/api/servicio/${id}`);
    const data = await response.json();
    return data;
} else {
    return undefined;
}
};