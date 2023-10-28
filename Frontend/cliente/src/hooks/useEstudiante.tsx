import { EstudianteContext } from '../Context';
import { useContext } from 'react'

export const useEstudianteContext = () => {
    const context = useContext(EstudianteContext);
    if (!context) {
        throw new Error('useEstudianteesContext debe usarse dentro de un CrudEstudianteesProvider');
    }
    return context;
};