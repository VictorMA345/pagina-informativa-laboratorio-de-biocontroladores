import React from 'react'
import './TableComponent.css'
import { Table,Button } from 'react-bootstrap'
import { NoticiaStructure,Noticia } from '../../Models'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import noImagePlaceHolder from '../../images/no-image-placeholder.jpg'

interface NoticiaTableComponentProps {
    columns: NoticiaStructure | undefined;
    data : Noticia[] | undefined;
    setNoticia : React.Dispatch<React.SetStateAction<Noticia | undefined>>;
}
export const NoticiaTableComponent: React.FC<NoticiaTableComponentProps>= ({data,columns,setNoticia}) => {
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
                data?.map((row : Noticia,index) =>(
                    <tr key = {index}>
                        {
                            columns && Object.values(columns).map((column,index) =>(
                                    column.show && 
                                    column.type === "multiple-images" &&
                                    <td key={index}>
                                        {
                                        row[column.keyName as keyof Noticia].length !== 0 ?   
                                        <img 
                                            src={row[column.keyName as keyof Noticia][0]} 
                                            alt={row[column.keyName as keyof Noticia][0]} 
                                            style={{ maxWidth: "12rem", maxHeight: "14rem",height:"14rem" }}
                                        /> :
                                        <img 
                                            src={noImagePlaceHolder} 
                                            alt={"No Image"} 
                                            style={{ maxWidth: "12rem", maxHeight: "14rem",height:"14rem" }}
                                        />
                                        }  
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
