import React from 'react'
import './TableComponent.css'
import { Table,Button } from 'react-bootstrap'
import { TesisStructure,Tesis } from '../../Models'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'
interface TesisTableComponentProps {
    columns: TesisStructure | undefined;
    data : Tesis[] | undefined;
    setTesis : React.Dispatch<React.SetStateAction<Tesis | undefined>>;
}
export const TesisTableComponent: React.FC<TesisTableComponentProps>= ({data,columns,setTesis}) => {
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
                data?.map((row : Tesis,index) =>(
                    row.estadoTesis !== "En ejecución" && <tr key = {index}>
                        {
                            columns && Object.values(columns).map((column,index) =>(
                                    column.show && 
                                    column.type === "single-image" &&
                                    <td key={index}>
                                        <img 
                                            src={String(row[column.keyName as keyof Tesis])} 
                                            alt={String(row[column.keyName as keyof Tesis])} 
                                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                                        />
                                    </td>
                                    ||
                                    column.show && 
                                    column.type === "date" &&
                                    <td key = {index}>
                                        {
                                            column.type === "date" && typeof row[column.keyName as keyof Tesis] === "string" ?
                                            formatDate(row[column.keyName as keyof Tesis] as string)
                                            :
                                            row.hasOwnProperty(column.keyName) && typeof row[column.keyName as keyof Tesis] === "string" ?
                                            row[column.keyName as keyof Tesis]
                                            : null
                                        } 
                                    </td>
                                    ||
                                    column.show && 
                                    <td key = {index}>
                                        {row[column.keyName as keyof Tesis]} 
                                    </td>
                            )
                            )
                        }
                        <td>
                            <Link className='link' to= {`/tesis/${row['_id']}`}>
                                <Button 
                                onClick={() => setTesis(row)}
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
