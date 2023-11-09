import { useState } from "react";
import { useAuthContext } from "./useAuthHook";

export const useLogin = () => {
  const [error, setError] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authContext = useAuthContext();
  const login = async (correo: string, contrasena: string) => {
    setIsLoading(true); 
    setError(null);
    const { dispatch } = authContext;
    const response = await fetch("https://laboratorio-biocontroladores.onrender.com/api/miembros/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: correo, contrasena: contrasena }),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    } else {
      const roleResponse = await fetch("https://laboratorio-biocontroladores.onrender.com/api/roles/" + json.role_name);
      const roleJson = await roleResponse.json();
      if (!roleResponse.ok) {
        setIsLoading(false);
        setError(json.error);
      }else{
        localStorage.setItem("user", JSON.stringify(json));
        dispatch({
          type: "LOGIN",
          payload: { user_data: json , role: roleJson},
        });
        setIsLoading(false);
      }
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};
