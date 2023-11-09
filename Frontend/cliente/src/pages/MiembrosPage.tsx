import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        MiembroCardComponent
       } from "../components"
import { useMiembroContext } from "../hooks/useMiembro"
import { MiembroStructure,getMiembroStructure } from "../Models"
import { Route,Routes  } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import "./page.css"
export const MiembrosPage = () => {
    const { state,dispatch } = useMiembroContext();
    const { t } = useTranslation();
    const [columnNames, setColumnNames] = useState<MiembroStructure | undefined>(undefined);
    const [filters, setfilters] = useState({})
    useEffect(() => {
      const fetchData = async() =>{
        setColumnNames(await getMiembroStructure())
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
                mainSection="asistentes"
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
                label={t('asistentes')}
              />
              <hr />
              {
              state.rows.length !== 0 ? 
              <Container className= "table-container">
                  {
                  state.rows.map((miembro) =>(
                    <MiembroCardComponent 
                      miembro={miembro}
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
