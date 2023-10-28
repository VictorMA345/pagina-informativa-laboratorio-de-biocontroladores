import React from 'react'
import './TableComponent.css'
import { Table,Button } from 'react-bootstrap'
import { ProyectoStructure,Proyecto } from '../../Models'
import { Link } from 'react-router-dom';
interface ProyectoTableComponentProps {
    columns: ProyectoStructure | undefined;
    data : Proyecto[] | undefined;
    setProyecto : React.Dispatch<React.SetStateAction<Proyecto | undefined>>;
}
export const ProyectoTableComponent: React.FC<ProyectoTableComponentProps>= ({data,columns,setProyecto}) => {
    const formatDate = (date: any) => {
        const options : Object = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(date).toLocaleDateString('en-US', options);
    };
  return (
    <>
    <Table responsive>
        <thead >
        <tr >
            {
                columns && Object.values(columns).map((column) =>
                (
                    column.show && <th className='table-head-cell'>
                        {column.name}
                    </th>      
                )   
            )}
            <th>
                Leer más
            </th>
        </tr>
        </thead>        

        <tbody>
            {
                data?.map((row : Proyecto,index) =>(
                    <tr key = {index}>
                        {
                            columns && Object.values(columns).map((column,index) =>(
                                    column.show && 
                                    column.type === "single-image" &&
                                    <td key={index}>
                                        <img 
                                            src={String(row[column.keyName as keyof Proyecto])} 
                                            alt={String(row[column.keyName as keyof Proyecto])} 
                                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                                        />
                                    </td>
                                    ||
                                    column.show && 
                                    column.type === "date" &&
                                    <td key = {index}>
                                        {row[column.keyName as keyof Proyecto] && formatDate(row[column.keyName as keyof Proyecto])} 
                                    </td>
                                    ||
                                    column.show && 
                                    <td key = {index}>
                                        {row[column.keyName as keyof Proyecto]} 
                                    </td>
                            )
                            )
                        }
                        <td>
                            <Link className='link' to= {`/proyectos/${row['_id']}`}>
                                <Button 
                                onClick={() => setProyecto(row)}
                                className='read-more-button'>
                                    Leer
                                    <i className='bx bx-chevron-right'>
                                    </i>
                                </Button>
                            </Link>
                        </td>
                    </tr>
                ))   
            }
        </tbody>
    </Table>
    </>
  )
}
