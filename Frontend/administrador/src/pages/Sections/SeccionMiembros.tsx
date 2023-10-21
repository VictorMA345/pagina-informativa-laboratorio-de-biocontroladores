import React, { useEffect,useState } from 'react';
import "./Seccion.css"
import { Table } from '../../components';
import { useMiembroContext } from '../../hooks/useMiembros';
import { MiembroStructure,getMiembroStructure } from '../../Models';
import { postMiembro,getMiembro,deleteMiembro,updateMiembro } from '../../services/miembrosService';
import { LoadingSpinner } from '../../components';
interface SeccionMiembrosProps {
    currentUser_id : string
}
export const SeccionMiembros: React.FC<SeccionMiembrosProps> = ({currentUser_id}) => {
    const { state , dispatch } = useMiembroContext();
    const [columnNames,setColumnNames] = useState<MiembroStructure | undefined>(undefined);
    const nombreSeccion : String = "Miembros" 
    const methods : any = {
        "GET": getMiembro,
        "POST": postMiembro,
        "DELETE": deleteMiembro,
        "UPDATE": updateMiembro
    }
    useEffect(() =>{
        const fetchColumns = async() =>{
            setColumnNames(await getMiembroStructure())
        }
        fetchColumns()
    },[])
    if (!state.rows || !columnNames) {
        return(
            <div className='miembros'>
                <LoadingSpinner />
            </div>
        )
    }
    return (
        <>
            <div className='miembros' >
                <Table     
                    seccion={nombreSeccion} 
                    contextData ={
                        {
                            rows: state.rows.filter(row => row._id !== currentUser_id),
                            itemCounts: state.itemCounts,
                            pagina : state.pagina,
                            cantidad : state.cantidad     
                        }
                    } 
                    contextActions={dispatch}
                    columns = {columnNames} 
                    methods = {methods}
                />
            </div>
        </>
    )
}
