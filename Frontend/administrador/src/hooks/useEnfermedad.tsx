import { EnfermedadContext } from '../context';
import { useContext } from 'react'

export const useEnfermedadContext = () => {
    const context = useContext(EnfermedadContext);
    if (!context) {
        throw new Error('useEnfermedadesContext debe usarse dentro de un CrudEnfermedadesProvider');
    }
    return context;
};