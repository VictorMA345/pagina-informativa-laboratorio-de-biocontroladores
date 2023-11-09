import { Rol } from "../Models";

interface RolServices {
  data: Rol[];
  itemCounts: number;
}

interface RolName {
    id: string;
    role_name: string;
}

export const getAllRolNames = async (): Promise<RolName[]> => {
    const apiUrl = "https://laboratorio-biocontroladores.onrender.com/api/names/roles"; 
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          return [];
        }
        const data: RolName[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
}


export const getAllRoles = async (
  pageNumber: number,
  selectedPage: number,
  search?: string,
  searchFor?: string,
  order?: string
): Promise<RolServices> => {
  try {
    let apiUrl = `https://laboratorio-biocontroladores.onrender.com/api/roles?pagina=${selectedPage}&cantidad=${pageNumber}`;
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
    const data: RolServices = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const postRol = async (newRol: Rol): Promise<Rol> => {
    try {
        const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/roles", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newRol),
        });
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};

export const deleteRol = async (id: string): Promise<Rol> => {
  try {
    const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/roles/${id}`, {
      method: 'DELETE',
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const updateRol = async (id: string, updatedData: Rol): Promise<Rol | undefined> => {
  if (id !== "") {
    try {
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/roles/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
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

export const getRol = async (id: string) => {
  if (id !== "") {
    try {
      const response = await fetch(`https://laboratorio-biocontroladores.onrender.com/api/roles/${id}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
