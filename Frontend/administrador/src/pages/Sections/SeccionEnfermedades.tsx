import { Table } from '../../components';
import { useEnfermedadContext } from '../../hooks/useEnfermedad';
import { EnfermedadStructure,getEnfermedadStructure } from '../../Models';
import { postEnfermedad,deleteEnfermedad,updateEnfermedad,getEnfermedad } from '../../services';
import { LoadingSpinner } from '../../components';
import "./Seccion.css"
export const SeccionEnfermedades = () => {
    const { state , dispatch } = useEnfermedadContext();
    const columnNames : EnfermedadStructure = getEnfermedadStructure();
    const nombreSeccion : String = "Enfermedades" 
    const methods : any = {
        "GET": getEnfermedad,
        "POST": postEnfermedad,
        "DELETE": deleteEnfermedad,
        "UPDATE": updateEnfermedad
    }
    if (!state.rows) {
        return(
            <div className='enfermedades'>
                <LoadingSpinner />
            </div>
        )
    }
    return (
    <>
        <div className='enfermedades'>
            <div className='module-description'>
            <h3 >
                Descripción del módulo
            </h3>
            <p>
                En esta sección se añade información sobre fitopatógenos investigados por el laboratorio que se desea mostrar al público.
            </p>
            </div>
            {
                <Table  
                    seccion={nombreSeccion} 
                    contextData ={state} 
                    contextActions={dispatch}
                    columns = {columnNames} 
                    methods = {methods}
                />
            }
        </div>
    </>
    )
}
