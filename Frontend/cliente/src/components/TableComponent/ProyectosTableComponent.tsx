import React from 'react'
import './TableComponent.css'
import { Table,Button } from 'react-bootstrap'
import { ProyectoStructure,Proyecto } from '../../Models'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
interface ProyectoTableComponentProps {
    columns: ProyectoStructure | undefined;
    data : Proyecto[] | undefined;
    setProyecto : React.Dispatch<React.SetStateAction<Proyecto | undefined>>;
}
export const ProyectoTableComponent: React.FC<ProyectoTableComponentProps>= ({data,columns,setProyecto}) => {
    const formatDate = (date: string) => {
        const originalDate = new Date(date);
        originalDate.setUTCHours(0, 0, 0, 0);
        const year = originalDate.getUTCFullYear();
        const month = `0${originalDate.getUTCMonth() + 1}`.slice(-2);
        const day = `0${originalDate.getUTCDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };
    const { t } = useTranslation();
  return (
    <>
    <Table responsive>
        <thead >
        <tr >
            {
                columns && Object.values(columns).map((column) =>
                (
                    column.show && <th className='table-head-cell'>
                        {t(column.keyName)}
                    </th>      
                )   
            )}
            <th>
                {t('leer_mas')}
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
                                        {
                                            column.type === "date" && typeof row[column.keyName as keyof Proyecto] === "string" ?
                                            formatDate(row[column.keyName as keyof Proyecto] as string)
                                            :
                                            row.hasOwnProperty(column.keyName) && typeof row[column.keyName as keyof Proyecto] === "string" ?
                                            row[column.keyName as keyof Proyecto]
                                            : null
                                        } 
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
                                    {t('leer')}
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
