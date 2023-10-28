import { ProyectoContext } from '../Context';
import { useContext } from 'react'

export const useProyectoContext = () => {
    const context = useContext(ProyectoContext);
    if (!context) {
        throw new Error('useProyectoContext debe usarse dentro de un CrudProyectoProvider');
    }
    return context;
};