import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        ColaboradorCardComponent
       } from "../components"
import { useColaboradorContext } from "../hooks/useColaborador"
import { ColaboradorStructure,getColaboradorStructure } from "../Models"
import { Route,Routes  } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import "./page.css"
export const InvestigadoresPage = () => {
    const { t } = useTranslation();
    const { state,dispatch } = useColaboradorContext();
    const [columnNames, setColumnNames] = useState<ColaboradorStructure | undefined>(undefined);
    const [filters, setfilters] = useState({})
    useEffect(() => {
      const fetchData = async() =>{
        setColumnNames(await getColaboradorStructure())
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
                mainSection="Investigadores"
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
                label={t('investigadores')}
              />
              <hr />
              {
              state.rows.length !== 0 ? 
              <Container className= "card-container">
                  {
                  state.rows.map((colaborador) =>(
                    <ColaboradorCardComponent 
                      colaborador={colaborador}
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
                context={state}
              />
              </>
          }
          >
          </Route>
        </Routes>
      </>
    )
}
