import { useState } from "react";
import { useAuthContext } from "./useAuthHook";

export const useSignUp = () => {
  const [error, setError] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const authContext = useAuthContext();

  const signup = async (correo: string, contrasena: string) => {
    setIsLoading(true);
    setError(null);
    const { dispatch } = authContext;
    const response = await fetch("http://localhost:3000/api/miembros/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: correo, contrasena: contrasena }),
    });
    const json = await response.json();
    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    } else {
      localStorage.setItem("user", JSON.stringify(json));
      dispatch({
        type: "LOGIN",
        payload: json,
      });
      setIsLoading(false);
    }
  };
  return { signup, isLoading, error };
};
