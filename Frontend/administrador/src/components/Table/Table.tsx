import "./Table.css"
import Form from 'react-bootstrap/Form';
import { ReactNode, useState } from "react"
import { TableIndexer,CreateModal,Filters,
        DeleteModal,EditModal,ViewModal } from ".."
import { useAuthContext } from "../../hooks/useAuthHook";
import { 
         MiembroStructure,EstudianteStructure,RolStructure,
         EnfermedadStructure,ControlBiologicoStructure,TesisStructure,
         NoticiaStructure,ProyectoStructure,ColaboradorStructure,ServicioStructure
        } 
from "../../Models";

interface FieldProperties {
    name: string;
    show: boolean;
    type: string;
    keyName: string;
    editable?: boolean;
    defaultValue?: string;
    choices?: string[];   
    choices_id?: string[];   
    [key: string]: any; 
}

// Adjust the ColumnTypes interface to allow string indexing
type ColumnTypes = (MiembroStructure | EstudianteStructure | RolStructure | EnfermedadStructure | ControlBiologicoStructure | TesisStructure | NoticiaStructure | ProyectoStructure | ColaboradorStructure | ServicioStructure | FieldProperties) & { [key: string]: any };
interface Table {
    seccion:String,
    contextData: {
        rows: any[],
        pagina:number,
        cantidad: number,
        itemCounts: number
    },
    contextActions: any
    columns: ColumnTypes,
    methods: {
        GET : ( id : string ) => any,
        POST : ( newData : Object ) => any,
        DELETE : ( id : string ) => any,
        UPDATE : () => void,
    }

}

export const Table : React.FC<Table>= ({ seccion, contextData, columns,contextActions,methods}) => {
    const [selectedItemId,setSelectedItemId] = useState<string>("");
    const [openCreateModal,setCreateModal] = useState<boolean>(false);
    const [openEditModal,setEditModal] = useState<boolean>(false);
    const [openDeleteModal,setDeleteModal] = useState<boolean>(false);
    const [openViewModal,setViewModal] = useState<boolean>(false);
    const { state } = useAuthContext();
    const handleDelete = (id: string) =>{
        setSelectedItemId(id);  
        setDeleteModal(!openDeleteModal);   
    }
    const handleView = (id: string) =>{
        setSelectedItemId(id);
        setViewModal(!openViewModal);
    }
    const handleEdit = (id:string) =>{
        setSelectedItemId(id);
        setEditModal(!openEditModal)
    }
    return (
    <>
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h2>
                                Control de {seccion}
                            </h2>
                        </div>  
                        <div className="col-sm-6">
                            {
                                state.user.role.general_permissions.create &&
                                <a className="btn btn-success" data-toggle="modal" onClick={() => setCreateModal(true)}>
                                    <i className="material-icons">
                                        &#xE147;
                                    </i> 
                                    <span>
                                        Añadir {seccion}
                                    </span>
                                </a>	
                            }
                        </div>  
                    </div>
                    </div>
                        <Filters 
                            dataStructure={columns}
                            actions={contextActions}
                        />
                    {contextData.rows.length !== 0 ? 
                    <table className="table table-striped table-hover">
                        <thead>
                            {
                                Object.values(columns).map((label : FieldProperties, index :number) => {
                                    if (label.show){
                                        return(
                                        <th key={index}>
                                            { label.name}
                                        </th>
                                        )
                                    }
                                })
                            }
                            <th>
                                Acciones
                            </th>
                        </thead>       
                         <tbody>
                        {contextData.rows.map((row) => {
                            return (
                                <tr key={row._id}>
                                {Object.values(columns).map((column: FieldProperties, index : number) => {
                                    const value = row[column.keyName];
                                    if (column.show) {
                                    if (column.type === "list" && Array.isArray(value)) {
                                        return (
                                        <td key={index}>
                                            <Form.Select>
                                            {value.map((item, itemIndex) => (
                                                <option key={itemIndex}>{item as ReactNode}</option>
                                            ))}
                                            </Form.Select>
                                        </td>
                                        );
                                    } else if (column.type === "selectable-fetched-list-text" && Array.isArray(value)) {
                                        return (
                                        <td key={index}>
                                            <Form.Select>
                                            {columns[column.keyName].choices_id.map((item : any, itemIndex : any) => {
                                                if (value.includes(item)) {
                                                return (
                                                    <option key={itemIndex}>{columns[column.keyName].choices[itemIndex]}</option>
                                                )
                                                }
                                            })}
                                            </Form.Select>
                                        </td>
                                        );
                                    } else if (column.type === "selectable-fetched-text") {
                                        const choiceIndex = columns[column.keyName].choices_id.indexOf(value);
                                        const choice = columns[column.keyName].choices[choiceIndex] || value;
                                        return (
                                        <td key={index}>{choice}</td>
                                        );
                                    } else if (
                                        column.type !== "list" &&
                                        column.type !== "document" &&
                                        column.type !== "images" &&
                                        column.type !== "selectable-fetched-list-text"
                                    ) {
                                        return (
                                        <td key={index}>{value}</td>
                                        );
                                    }   
                                    }
                                    return null;
                                })}
                                            <td>
                                                {
                                                    state.user.role.general_permissions.update &&
                                                    <a className="edit" data-toggle="modal" onClick={() => handleEdit(row._id)}>
                                                        <i className="bx bx-edit " >
                                                        </i>
                                                    </a>               
                                                }
                                                {
                                                    state.user.role.general_permissions.delete &&
                                                    <a className="delete" data-toggle="modal" onClick={() => handleDelete(row._id)} >
                                                        <i className="bx bx-trash" >
                                                        </i>
                                                    </a>
                                                }
                                                <a className="read" data-toggle="modal" onClick={() => handleView(row._id)}>
                                                    <i className="bx bx-show " >
                                                    </i>
                                                </a>    
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody> 
                        
                    </table>
                    :
                    <div className="no-results">
                        <h4 >
                            No hay Datos de {seccion}
                        </h4>
                    </div>
                    }
                    <TableIndexer 
                        context={contextData} 
                        actions={contextActions}
                    />
                </div>    
            </div>      
        </div>  
        {/* Modals */}
        <CreateModal 
            context={contextData} 
            actions={contextActions}
            setCreateState = {setCreateModal} 
            createState = {openCreateModal} 
            dataStructure = {columns}
            postMethod = {methods.POST}
        />
        <DeleteModal 
            actions={contextActions}
            setDeleteModal = {setDeleteModal} 
            openDeleteModal = {openDeleteModal}
            id = {selectedItemId}
            deleteMethod={methods.DELETE}
        />
        <EditModal
            actions={contextActions}
            setEditModal={setEditModal}
            openEditModal={openEditModal}
            id = {selectedItemId}
            getMethod = {methods.GET}
            updateMethod={methods.UPDATE}
            dataStructure={columns}
        />  
        <ViewModal
            openViewModal = { openViewModal }
            setViewModal={ setViewModal }
            id = {selectedItemId}
            dataStructure = {columns}
            getMethod={methods.GET}
        />
    </>
    )
}