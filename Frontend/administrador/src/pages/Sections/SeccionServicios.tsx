import { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useServicioContext } from '../../hooks/useServicio'; // Importa el contexto de servicios
import { ServicioStructure, getServicioStructure } from '../../Models'; // Importa la estructura y métodos de servicios
import { getServicio, deleteServicio, updateServicio, postServicio } from '../../services'; // Importa los métodos de servicios
import { LoadingSpinner } from '../../components';
import "./Seccion.css"
export const SeccionServicios = () => {
  const { state, dispatch } = useServicioContext(); // Utiliza el contexto de servicios
  const nombreSeccion: string = 'Servicios';
  const [columnNames, setColumnNames] = useState<ServicioStructure | undefined>(undefined);
  const methods: any = {
    GET: getServicio,
    POST: postServicio,
    DELETE: deleteServicio,
    UPDATE: updateServicio,
  };
  useEffect(() => {
    const fetchColumns = async () => {
      setColumnNames(await getServicioStructure());
    };
    fetchColumns();
  }, []);

  if (!state.rows || !columnNames) {
    return (
      <div className='servicios'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='servicios'>
      <div className='module-description'>
        <h3 >
            Descripción del módulo
        </h3>
        <p>
           En esta sección se agregan servicios que brinde el laboratorio, de modo que estos servicios se publiquen en la página.
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
