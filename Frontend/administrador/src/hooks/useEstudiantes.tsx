import { EstudiantesContext } from '../context';
import { useContext } from 'react'

export const useEstudiantesContext = () => {
    const context = useContext(EstudiantesContext);
    if (!context) {
        throw new Error('useEstudiantesContext debe usarse dentro de un CrudEstudiantesProvider');
    }
    return context;
};