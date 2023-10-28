import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        NoticiaTableComponent,SelectedNoticiaSection
       } from "../components"
import { useNoticiaContext } from "../hooks/useNoticia"
import { NoticiaStructure,getNoticiaStructure,Noticia } from "../Models"
import { Route,Routes,useLocation  } from "react-router-dom"
import "./page.css"
export const NoticiasPage = () => {
  const { state,dispatch } = useNoticiaContext();
  const [columnNames, setColumnNames] = useState<NoticiaStructure | undefined>(undefined);
  const [selectedItem, setselectedItem] = useState<Noticia | undefined>(undefined)

  const [filters, setfilters] = useState({})
  
  const location = useLocation();
  useEffect(() => {
    const fetchData = async() =>{
      setColumnNames(await getNoticiaStructure())
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (location.pathname === "/noticias") {
      setselectedItem(undefined);
    }
  }, [location]);

  if(!state.rows || !columnNames){
    return (
      <div>
        <LoadingSpinner />
      </div>  
    )
  }
  return (
    <>
      <Routes>
        <Route 
          path={`/:id`}
          element={
          <>
            {
              selectedItem ? 
              <>
                <BreadCrumbsComponent 
                  mainSection="noticias"
                  itemSection={selectedItem ? selectedItem.titulo : ""}
                  itemId={selectedItem ? selectedItem._id : ""}
                />
                <SectionLabel 
                  label={ selectedItem?.titulo || ""}
                />
                <SelectedNoticiaSection 
                  noticia={selectedItem}
                />
              </>
              :
              <>
              </>
            }
          </>
        }
        >
        </Route>
        <Route 
          path={`/`}
          element={
            <>
            <BreadCrumbsComponent 
              mainSection="noticias"
              itemSection={selectedItem ? selectedItem.titulo : ""}
              itemId={""}
            />
            <Filters
              structure={Object.values(columnNames)}
              actions={dispatch}
              filtersState={filters}
              setFilters={setfilters}
             />
            <SectionLabel 
              label="Noticias"
            />
            <hr />
            {
            state.rows.length !== 0 ? 
            <Container className= "table-container">
              <NoticiaTableComponent 
                columns={columnNames}
                data={state.rows}
                setNoticia={setselectedItem}
              />
            </Container>
            :
            <NoResultsLabel />
            }
            <PaginationComponent 
              totalItems={state.itemCounts}
              itemsPerPage={state.cantidad}
              currentPage={state.pagina}
              actions = {dispatch}
              filters={filters}
            />
            </>
        }
        >
        </Route>
      </Routes>
    </>
  )
}
