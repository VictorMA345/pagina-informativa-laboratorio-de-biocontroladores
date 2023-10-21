import { NoticiaContext } from '../context'; 
import { useContext } from 'react';
export const useNoticiaContext = () => {
    const context = useContext(NoticiaContext); 
    if (!context) {
        throw new Error('useNoticiaContext debe usarse dentro de un NoticiaContextProvider'); 
    }
    return context;
};
