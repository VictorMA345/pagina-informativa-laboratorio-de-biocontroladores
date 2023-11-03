import { jsonToFormData } from ".";
export const getGeneralInfo = async () => {
    let apiUrl = `http://localhost:3000/api/informacion`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

export const updateGeneralInfo = async (newData : Object) => {
    try {
        const formData = jsonToFormData(newData);
        const response = await fetch(`http://localhost:3000/api/informacion`, {
            method: "PATCH",
            body: formData,
        });
        if (!response.ok) {
            console.log("Error a la hora de actualizar información");
        }
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.log(error);
        throw error;
    } 
};