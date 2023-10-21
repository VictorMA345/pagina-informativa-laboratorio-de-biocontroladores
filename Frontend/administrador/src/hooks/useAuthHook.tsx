import { AuthContext } from "../context";
import { useContext } from "react";
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw Error(
      "useAuthContext debe estar dentro de un proveedor de contexto AuthContextProvider."
    );
  }
  return context;
};

