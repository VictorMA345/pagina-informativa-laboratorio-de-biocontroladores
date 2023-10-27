import { TesisContext } from '../Context'; 
import { useContext } from 'react';

export const useTesisContext = () => {
    const context = useContext(TesisContext); 
    if (!context) {
        throw new Error('useTesisContext debe usarse dentro de un TesisContextProvider'); 
    }
    return context; 
};