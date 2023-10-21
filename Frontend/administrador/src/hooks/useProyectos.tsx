import { ProyectoContext } from '../context'; // Asegúrate de importar el contexto correcto
import { useContext } from 'react';

export const useProyectoContext = () => {
    const context = useContext(ProyectoContext); // Asegúrate de usar el contexto correcto aquí
    if (!context) {
        throw new Error('useProyectoContext debe usarse dentro de un ProyectoContextProvider'); // Asegúrate de que el nombre coincida con tu contexto
    }
    return context;
};
