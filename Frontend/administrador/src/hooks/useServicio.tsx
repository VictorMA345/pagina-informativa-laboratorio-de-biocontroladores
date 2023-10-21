import { ServicioContext } from '../context'; // Asegúrate de importar el contexto correcto
import { useContext } from 'react';

export const useServicioContext = () => {
    const context = useContext(ServicioContext); // Asegúrate de usar el contexto correcto aquí
    if (!context) {
        throw new Error('useServicioContext debe usarse dentro de un ServicioContextProvider'); // Asegúrate de que el nombre coincida con tu contexto
    }
    return context;
};