import { useState,useEffect } from 'react'
import "./Seccion.css"
import { Table } from "../../components"
import { useColaboradorContext } from '../../hooks/useColaboradores';
import { ColaboradorStructure,getColaboradorStructure } from '../../Models';
import { postColaborador,getColaborador,deleteColaborador,updateColaborador } from '../../services';
import { LoadingSpinner } from '../../components';
export const SeccionColaboradores = () => {
  const { state , dispatch } = useColaboradorContext();
  const nombreSeccion : String = "Investigadores" 
  const [columnNames,setColumnNames] = useState<ColaboradorStructure | undefined>(undefined);
  const methods : any = {
      "GET": getColaborador,
      "POST": postColaborador,
      "DELETE": deleteColaborador,
      "UPDATE": updateColaborador
  }
  useEffect(() =>{
    const fetchColumns = async() =>{
        setColumnNames(await getColaboradorStructure())
    }
    fetchColumns()
  },[])

  if (!state.rows || !columnNames) {
    return(
        <div className='colaboradores'>
            <LoadingSpinner />
        </div>  
    )
  }
  return (
    <div>
        <div className='colaboradores'>
            <Table     
                seccion={nombreSeccion} 
                contextData ={state} 
                contextActions={dispatch}
                columns = {columnNames} 
                methods = {methods}
            />
        </div>
    </div>
  )
}
