import { MiembroContext } from '../Context'; 
import { useContext } from 'react';

export const useMiembroContext = () => {
    const context = useContext(MiembroContext); 
    if (!context) {
        throw new Error('useMiembroContext debe usarse dentro de un MiembroContextProvider'); 
    }
    return context; 
};