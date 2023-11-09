export const sendMail = async (
    nombre: string,
    asunto: string,
    correo: string,
    cuerpo: string
  ) => {
    try {
      const json = {
        nombre: nombre,
        correo: correo,
        asunto: asunto,
        cuerpo: cuerpo
      };
      const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/email-service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
      });
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  };
  