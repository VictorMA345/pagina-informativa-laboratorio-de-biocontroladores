import { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useControlBiologicoContext } from '../../hooks/useControl_biologico'; // Importa el contexto de control_biologico
import { ControlBiologicoStructure, getControlBiologicoStructure } from '../../Models'; // Importa la estructura y métodos de control_biologico
import { getControlBiologico, deleteControlBiologico, updateControlBiologico, postControlBiologico } from '../../services'; // Importa los métodos de control_biologico
import { LoadingSpinner } from '../../components';
export const SeccionControlBiologico = () => {
  const { state, dispatch } = useControlBiologicoContext(); // Utiliza el contexto de control_biologico
  const nombreSeccion: string = 'Control Biológico';
  const [columnNames, setColumnNames] = useState<ControlBiologicoStructure | undefined>(undefined);
  const methods: any = {
    GET: getControlBiologico,
    POST: postControlBiologico,
    DELETE: deleteControlBiologico,
    UPDATE: updateControlBiologico,
  };
  
  useEffect(() => {
    const fetchColumns = async () => {
      setColumnNames(await getControlBiologicoStructure());
    };
    fetchColumns();
  }, []);

  if (!state.rows || !columnNames) {
    return (
      <div className='control-biologico'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='control-biologico'>
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
