import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        EstudianteCardComponent
       } from "../components"
import { useEstudianteContext } from "../hooks/useEstudiante"
import { EstudianteStructure,getEstudianteStructure } from "../Models"
import { Route,Routes  } from "react-router-dom"
import { useTranslation } from 'react-i18next' 
import "./page.css"
export const EstudiantesPage = () => {
    const { state,dispatch } = useEstudianteContext();
    const [columnNames, setColumnNames] = useState<EstudianteStructure | undefined>(undefined);
    const [filters, setfilters] = useState({})
    const { t } = useTranslation();
    useEffect(() => {
      const fetchData = async() =>{
        setColumnNames(await getEstudianteStructure())
      }
      fetchData();
    }, [])
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
            path={`/`}
            element={
              <>
              <BreadCrumbsComponent 
                mainSection="estudiantes"
                itemSection=""
                itemId={""}
              />
              <Filters
                structure={Object.values(columnNames)}
                actions={dispatch}
                filtersState={filters}
                setFilters={setfilters}
               />
              <SectionLabel 
                label={t('estudiantes')}
              />
              <hr />
              {
              state.rows.length !== 0 ? 
              <Container className= "table-container">
                  {
                  state.rows.map((estudiante) =>(
                    <EstudianteCardComponent 
                      estudiante={estudiante}
                      />
                  )
                  )}
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
