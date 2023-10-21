import { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useRolContext } from '../../hooks/useRoles'; // Importa el contexto de roles
import { RolStructure, getRolStructure } from '../../Models'; // Importa la estructura y métodos de roles
import { getRol, deleteRol, updateRol, postRol } from '../../services'; // Importa los métodos de roles
import { LoadingSpinner } from '../../components';
import "./Seccion.css"
export const SeccionRoles = () => {
  const { state, dispatch } = useRolContext(); // Utiliza el contexto de roles
  const nombreSeccion: string = 'Roles';
  const [columnNames, setColumnNames] = useState<RolStructure | undefined>(undefined);
  const methods: any = {
    GET: getRol,
    POST: postRol,
    DELETE: deleteRol,
    UPDATE: updateRol,
  };

  useEffect(() => {
    const fetchColumns = async () => {
      setColumnNames(await getRolStructure());
    };
    fetchColumns();
  }, []);

  if (!state.rows || !columnNames) {
    return (
      <div className='roles'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='roles'>
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
