import { ReactNode, useState,useEffect } from 'react';
import './TableIndexer.css';


interface TableIndexer {  
  context: {
    rows: any[],
    pagina:number,
    cantidad: number,
    itemCounts: number
  },
  actions: any
}

export const TableIndexer: React.FC<TableIndexer> = ({context,actions}) => {
  const [pagina, setpagina] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [maxItems, setMaxItems] = useState(0); 
  const [maxPages,setMaxPages] = useState(maxItems % cantidad === 0 ? Math.floor(maxItems / cantidad) : Math.floor(maxItems / cantidad ) + 1  );

  useEffect(() => {
    setpagina(context.pagina);
    setCantidad(context.cantidad);
    setMaxItems(context.itemCounts);
    setMaxPages(maxItems % cantidad === 0 ? Math.floor(maxItems / cantidad) : Math.floor(maxItems / cantidad ) + 1);
  }, [context])
  
  const goToPage = (page: number) => {  
    if(pagina !== page){
      setpagina(page);
      actions(
        {
          type:"SET_ITEM",
          rows: [],
          cantidad: cantidad,
          pagina: page,
          itemCounts: maxItems
      });
    }
  };

  const goToPreviousPage = () => {
    if (pagina > 1) {
      setpagina(pagina - 1);
      actions(
        {
          type:"SET_ITEM",
          rows: [],
          cantidad: cantidad,
          pagina: pagina - 1,
          itemCounts: maxItems
      });
    }
  };

  const goToNextPage = () => {
    if (pagina < maxPages) {
      setpagina(pagina + 1);  
      actions(
        {
          type:"SET_ITEM",
          rows: [],
          cantidad: cantidad,
          pagina: pagina + 1,
          itemCounts: maxItems
      });
    }
  };
  const handleCantidadChange = (event : React.ChangeEvent<HTMLSelectElement>) => {
    const cambioCantidad = parseInt(event.target.value);
    actions(
      {
        type:"SET_ITEM",
        rows: [],
        cantidad:cambioCantidad,
        pagina: 1,
        itemCounts: context.itemCounts
    });
  };
  const renderPageNumbers = () => {
    const visiblePages = 5; 
    const halfVisible = Math.floor(visiblePages / 2);
    const startPage = Math.max(pagina - halfVisible, 1);
    const endPage = Math.min(startPage + visiblePages - 1, maxPages);
    const pages: JSX.Element[] = [];
    if (pagina > 1) {
      pages.push(
        <li key="first" className="page-item">
          <a href="#" className="page-link" onClick={() => goToPage(1)}>
            {"<<"}
          </a>
        </li>
      );
    }
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <li key={page} className={`page-item ${pagina === page ? 'active' : ''}`}>
          <a className="page-link" onClick={() => goToPage(page)}>
            {page}
          </a>
        </li>
      );
    }

    if (pagina < maxPages) {
      pages.push(
        <li key="last" className="page-item">
          <a href="#" className="page-link" onClick={() => goToPage(maxPages)}>
            {">>"}
          </a>
        </li>
      );
    }
    return pages;
  };
  return (
    <div className="clearfix">
      <div className="hint-text">
          Mostrando
          &nbsp;
        <b>
          <select className="form-control" value={context.cantidad} onChange={handleCantidadChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={75}>75</option>
          </select>    
        </b>        
        &nbsp;
        de
        &nbsp;
        <b>
          {context.itemCounts as ReactNode}
        </b> 
        &nbsp;
        resultados
      </div>
      <ul className="pagination">
        <li className={`page-item ${pagina === 1 ? 'disabled' : ''}`}>
          <a className="page-link" onClick={goToPreviousPage}>
            {"<"}
          </a>
        </li>
        {renderPageNumbers()}
        <li className={`page-item ${pagina === maxPages ? 'disabled' : ''}`}>
          <a className="page-link" onClick={goToNextPage}>
            {">"}
          </a>
        </li>
      </ul>
    </div>
  );
};
