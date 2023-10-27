import React from 'react'
import './TableComponent.css'
import { Table,Button } from 'react-bootstrap'
import { TesisStructure,Tesis } from '../../../Models'
import { Link } from 'react-router-dom';
interface TesisTableComponentProps {
    columns: TesisStructure | undefined;
    data : Tesis[] | undefined;
    setTesis : React.Dispatch<React.SetStateAction<Tesis | undefined>>;
}
export const TesisTableComponent: React.FC<TesisTableComponentProps>= ({data,columns,setTesis}) => {

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
                data?.map((row : Tesis,index) =>(
                    <tr key = {index}>
                        {
                            columns && Object.values(columns).map((column,index) =>(
                                    column.show && 
                                    column.type === "single-image" &&
                                    <td key={index}>
                                        <img 
                                            src={row[column.keyName]} 
                                            alt={row[column.keyName]} 
                                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                                        />
                                    </td>
                                    ||
                                    column.show && 
                                    column.type === "date" &&
                                    <td key = {index}>
                                        {row[column.keyName]} 
                                    </td>
                                    ||
                                    column.show && 
                                    <td key = {index}>
                                        {row[column.keyName]} 
                                    </td>
                            )
                            )
                        }
                        <td>
                            <Link className='tesis-link' to= {`/tesis/${row['_id']}`}>
                                <Button 
                                onClick={() => setTesis(row)}
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
