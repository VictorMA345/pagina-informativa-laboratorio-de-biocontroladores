  import { createContext, useReducer, ReactNode } from 'react';

  // Definición de tipos
  type AuthState = {
    user: any | null; 
  };

  type AuthAction =
    | { type: 'LOGIN', payload: any } 
    | { type: 'LOGOUT' }
    | { type: 'SIGNUP' }; 

  type AuthContextType = {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
  };

  // Reductor de autenticación
  export const authReducer = (state: AuthState, action: AuthAction): any => {
      switch (action.type) {
          case 'LOGIN':
              return { user: action.payload };
          case 'LOGOUT':
              return { user: null };
          default:
              return state;
      }
  };

  // Contexto de autenticación
  export const AuthContext = createContext<AuthContextType | undefined>(undefined);

  // Proveedor de contexto de autenticación
  type AuthContextProviderProps = {
    children: ReactNode;
  };

  export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
      user: null
    });
    return (
      <AuthContext.Provider value={{ state, dispatch }}>
        {children}
      </AuthContext.Provider>
    );
  };
