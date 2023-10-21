import { ColaboradorContext } from '../context';
import { useContext } from 'react'

export const useColaboradorContext = () => {
    const context = useContext(ColaboradorContext);
    if (!context) {
        throw new Error('useColaboradorContext debe usarse dentro de un CrudColaboradorProvider');
    }
    return context;
};