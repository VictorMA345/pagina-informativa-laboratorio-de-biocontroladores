import { ControlBiologicoContext } from '../Context'; 
import { useContext } from 'react';

export const useControlBiologicoContext = () => {
    const context = useContext(ControlBiologicoContext); 
    if (!context) {
        throw new Error('useControlBiologicoContext debe usarse dentro de un ControlBiologicoContextProvider'); 
    }
    return context; 
};