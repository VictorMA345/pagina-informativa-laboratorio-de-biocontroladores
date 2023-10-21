import { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useProyectoContext } from '../../hooks/useProyectos'; // Importa el contexto de Proyectos
import { ProyectoStructure, getProyectoStructure } from '../../Models'; // Importa la estructura y métodos de Proyectos
import { getProyecto, deleteProyecto, updateProyecto, postProyecto } from '../../services'; // Importa los métodos de Proyectos
import { LoadingSpinner } from '../../components';
import "./Seccion.css"
export const SeccionProyectos = () => {
  const { state, dispatch } = useProyectoContext(); // Utiliza el contexto de Proyectos
  const nombreSeccion: string = 'Proyectos';
  const [columnNames, setColumnNames] = useState<ProyectoStructure | undefined>(undefined);
  const methods: any = {
    GET: getProyecto,
    POST: postProyecto,
    DELETE: deleteProyecto,
    UPDATE: updateProyecto,
  };
  
  useEffect(() => {
    const fetchColumns = async () => {
      setColumnNames(await getProyectoStructure());
    };
    fetchColumns();
  }, []);

  if (!state.rows || !columnNames) {
    return (
      <div className='proyectos'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='proyectos'>
      <Table
        seccion={nombreSeccion}
        contextData={state}
        contextActions={dispatch}
        columns={columnNames}
        methods={methods}
      />
    </div>
  );
};
