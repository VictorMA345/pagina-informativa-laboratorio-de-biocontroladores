import { useState, useEffect } from 'react';
import { Table } from '../../components';
import { useNoticiaContext } from '../../hooks/useNoticias'; // Importa el contexto de Noticias
import { NoticiaStructure, getNoticiaStructure } from '../../Models'; // Importa la estructura y métodos de Noticias
import { getNoticia, deleteNoticia, updateNoticia, postNoticia } from '../../services'; // Importa los métodos de Noticias
import { LoadingSpinner } from '../../components';
import "./Seccion.css"
export const SeccionNoticias = () => {
  const { state, dispatch } = useNoticiaContext(); // Utiliza el contexto de Noticias
  const nombreSeccion: string = 'Noticias';
  const [columnNames, setColumnNames] = useState<NoticiaStructure | undefined>(undefined);
  const methods: any = {
    GET: getNoticia,
    POST: postNoticia,
    DELETE: deleteNoticia,
    UPDATE: updateNoticia,
  };

  useEffect(() => {
    const fetchColumns = async () => {
      setColumnNames(await getNoticiaStructure());
    };
    fetchColumns();
  }, []);

  if (!state.rows || !columnNames) {
    return (
      <div className='noticias'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='noticias'>
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
