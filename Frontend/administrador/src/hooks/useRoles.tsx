import { RolContext } from '../context'; 
import { useContext } from 'react';

export const useRolContext = () => {
    const context = useContext(RolContext); 
    if (!context) {
        throw new Error('useRolContext debe usarse dentro de un RolContextProvider'); 
    }
    return context;
};
