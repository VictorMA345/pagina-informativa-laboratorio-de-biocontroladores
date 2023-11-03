import { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useTesisContext } from '../../hooks/useTesis'; // Importa el contexto de tesis
import { TesisStructure, getTesisStructure } from '../../Models'; // Importa la estructura y métodos de tesis
import { getTesis, deleteTesis, updateTesis, postTesis } from '../../services'; // Importa los métodos de tesis
import { LoadingSpinner } from '../../components';
import "./Seccion.css"
export const SeccionTesis = () => {
  const { state, dispatch } = useTesisContext(); // Utiliza el contexto de tesis
  const nombreSeccion: string = 'Tesis';
  const [columnNames, setColumnNames] = useState<TesisStructure | undefined>(undefined);
  const methods: any = {
    GET: getTesis,
    POST: postTesis,
    DELETE: deleteTesis,
    UPDATE: updateTesis,
  };
  useEffect(() => {
    const fetchColumns = async () => {
      setColumnNames(await getTesisStructure());
    };
    fetchColumns();
  }, []);
  if (!state.rows || !columnNames) {
    return (
      <div className='tesis'>
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className='tesis'>
      <div className='module-description'>
        <h3 >
            Descripción del módulo
        </h3>
        <p>
           En esta sesión se agregan tesis de estudiantes que se deseen mostrar al público.
        </p>
      </div>
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
