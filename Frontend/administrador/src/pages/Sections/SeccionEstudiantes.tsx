import { useState,useEffect } from 'react'
import { Table } from "../../components"
import { useEstudiantesContext } from '../../hooks/useEstudiantes'
import { EstudianteStructure,getEstudianteStructure } from '../../Models'
import { getEstudiante,deleteEstudiante,updateEstudiante,postEstudiante } from '../../services'
import { LoadingSpinner } from '../../components';
import "./Seccion.css"
export const SeccionEstudiantes = () => {
  const { state , dispatch } = useEstudiantesContext();
  const nombreSeccion : String = "Estudiantes" 
  const [columnNames,setColumnNames] = useState<EstudianteStructure | undefined>(undefined);
  const methods : any = {
      "GET": getEstudiante,
      "POST": postEstudiante,
      "DELETE": deleteEstudiante,
      "UPDATE": updateEstudiante
  }
  useEffect(() =>{
    const fetchColumns = async() =>{
        setColumnNames(await getEstudianteStructure())
    }
    fetchColumns()
  },[])
  if (!state.rows || !columnNames) {
    return(
        <div className='estudiantes'>
            <LoadingSpinner />
        </div>
    )
  }
  return (
    <div className='estudiantes'>
      <div className='module-description'>
        <h3 >
            Descripción del módulo
        </h3>
        <p>
           En esta sección se agregan estudiantes tesiarios o pasantes involucrados directamente con el laboratorio.
        </p>
      </div>
      <Table     
          seccion={nombreSeccion} 
          contextData ={state} 
          contextActions={dispatch}
          columns = {columnNames} 
          methods = {methods}
      />
    </div>
  )
}
