import React from 'react'
import './TableComponent.css'
import { Table,Button } from 'react-bootstrap'
import { NoticiaStructure,Noticia } from '../../Models'
import { Link } from 'react-router-dom';
interface NoticiaTableComponentProps {
    columns: NoticiaStructure | undefined;
    data : Noticia[] | undefined;
    setNoticia : React.Dispatch<React.SetStateAction<Noticia | undefined>>;
}
export const NoticiaTableComponent: React.FC<NoticiaTableComponentProps>= ({data,columns,setNoticia}) => {
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
                data?.map((row : Noticia,index) =>(
                    <tr key = {index}>
                        {
                            columns && Object.values(columns).map((column,index) =>(
                                    column.show && 
                                    column.type === "multiple-images" &&
                                    <td key={index}>
                                        <img 
                                            src={row[column.keyName as keyof Noticia][0]} 
                                            alt={row[column.keyName as keyof Noticia][0]} 
                                            style={{ maxWidth: "12rem", maxHeight: "14rem",height:"14rem" }}
                                        />
                                    </td>
                                    ||
                                    column.show && 
                                    column.type === "date" &&
                                    <td key = {index}>
                                        {row[column.keyName as keyof Noticia] && formatDate(row[column.keyName as keyof Noticia])} 
                                    </td>
                                    ||
                                    column.show && 
                                    <td key = {index}>
                                        {row[column.keyName as keyof Noticia]} 
                                    </td>
                            )
                            )
                        }
                        <td>
                            <Link className='link' to= {`/noticias/${row['_id']}`}>
                                <Button 
                                onClick={() => setNoticia(row)}
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
