import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        TesisTableComponent,SelectedTesisSection, NotFoundComponent
       } from "../components"
import { useTesisContext } from "../hooks/useTesis"
import { TesisStructure,getTesisStructure,Tesis } from "../Models"
import { Route,Routes,useLocation  } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import "./page.css"
export const TesisPage = () => {
  const { state,dispatch } = useTesisContext();
  const [columnNames, setColumnNames] = useState<TesisStructure | undefined>(undefined);
  const [selectedItem, setselectedItem] = useState<Tesis | undefined>(undefined)

  const [filters, setfilters] = useState({})
  
  const { t } = useTranslation();
  const location = useLocation();
  useEffect(() => {
    const fetchData = async() =>{
      setColumnNames(await getTesisStructure())
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (location.pathname === "/tesis") {
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
                  mainSection="tesis"
                  itemSection={selectedItem ? selectedItem.tituloTesis : ""}
                  itemId={selectedItem ? selectedItem._id : ""}
                />
                <SectionLabel 
                  label={ selectedItem?.tituloTesis || ""}
                />
                <SelectedTesisSection 
                  selectedTesis={selectedItem}
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
              mainSection="tesis"
              itemSection={selectedItem ? selectedItem.tituloTesis : ""}
              itemId={""}
            />
            <Filters
              structure={Object.values(columnNames)}
              actions={dispatch}
              filtersState={filters}
              setFilters={setfilters}
             />
            <SectionLabel 
              label={t('tesis_estudiantes')}
            />
            <hr />
            {
            state.rows.length !== 0 ? 
            <Container className= "table-container">

              <TesisTableComponent 
                columns={columnNames}
                data={state.rows}
                setTesis={setselectedItem}
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
