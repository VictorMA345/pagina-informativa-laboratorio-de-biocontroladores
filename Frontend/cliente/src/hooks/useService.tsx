import { ServicioContext } from '../Context'; 
import { useContext } from 'react';

export const useServicioContext = () => {
    const context = useContext(ServicioContext); 
    if (!context) {
        throw new Error('useServicioContext debe usarse dentro de un ServicioContextProvider'); 
    }
    return context; 
};