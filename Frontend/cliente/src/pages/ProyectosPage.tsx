import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        ProyectoTableComponent,SelectedProyectoSection
        , NotFoundComponent
       } from "../components"
import { useProyectoContext } from "../hooks/useProyecto"
import { ProyectoStructure,getProyectoStructure,Proyecto } from "../Models"
import { Route,Routes,useLocation  } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import "./page.css"
export const ProyectosPage = () => {
  const { state,dispatch } = useProyectoContext();
  const [columnNames, setColumnNames] = useState<ProyectoStructure | undefined>(undefined);
  const [selectedItem, setselectedItem] = useState<Proyecto | undefined>(undefined)
  const { t } = useTranslation();
  const [filters, setfilters] = useState({})
  
  const location = useLocation();
  useEffect(() => {
    const fetchData = async() =>{
      setColumnNames(await getProyectoStructure())
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (location.pathname === "/proyectos") {
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
                  mainSection="proyectos"
                  itemSection={selectedItem ? selectedItem.tituloProyecto : ""}
                  itemId={selectedItem ? selectedItem._id : ""}
                />
                <SectionLabel 
                  label={ selectedItem?.tituloProyecto || ""}
                />
                <SelectedProyectoSection 
                  proyecto={selectedItem}
                />
              </>
              :
              <NotFoundComponent />
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
              mainSection="proyectos"
              itemSection={selectedItem ? selectedItem.tituloProyecto : ""}
              itemId={""}
            />
            <Filters
              structure={Object.values(columnNames)}
              actions={dispatch}
              filtersState={filters}
              setFilters={setfilters}
             />
            <SectionLabel 
              label={t('proyectos_elaborados')}
            />
            <hr />
            {
            state.rows.length !== 0 ? 
            <Container className= "table-container">
              <ProyectoTableComponent 
                columns={columnNames}
                data={state.rows}
                setProyecto={setselectedItem}
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
