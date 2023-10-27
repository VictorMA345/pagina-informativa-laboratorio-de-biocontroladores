import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        ColaboradorCardComponent
        // SelectedControlBiologicoSection,ControlBiologicoCardComponent
       } from "../components"
import { useColaboradorContext } from "../hooks/useColaborador"
import { ColaboradorStructure,getColaboradorStructure,Colaborador } from "../Models"
import { Route,Routes,useLocation  } from "react-router-dom"
import "./page.css"
export const InvestigadoresPage = () => {
    const { state,dispatch } = useColaboradorContext();
    const [columnNames, setColumnNames] = useState<ColaboradorStructure | undefined>(undefined);
    const [selectedItem, setselectedItem] = useState<Colaborador | undefined>(undefined)
  
    const [filters, setfilters] = useState({})
    const location = useLocation();
    useEffect(() => {
      const fetchData = async() =>{
        setColumnNames(await getColaboradorStructure())
      }
      setselectedItem(undefined)
      fetchData();
    }, [])
  
    useEffect(() => {
      if (location.pathname === "/investigadores") {
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
          {/* <Route 
            path={`/:id`}
            element={
            <>
              {
                selectedItem ? 
                <>
                  <BreadCrumbsComponent 
                    mainSection="control_biologico"
                    itemSection={selectedItem ? selectedItem.nombreInvestigacion : ""}
                    itemId={selectedItem ? selectedItem._id : ""}
                  />
                  <SectionLabel 
                    label={ selectedItem?.nombreInvestigacion || ""}
                  />
                   <SelectedControlBiologicoSection 
                    controlbiologico={selectedItem}
                  /> 
                </>
                :
                <>
                </>
              }
            </>
          }
          >
          </Route> */}
  
          <Route 
            path={`/`}
            element={
              <>
              <BreadCrumbsComponent 
                mainSection="Investigadores"
                itemSection=""
                // itemSection={selectedItem ? selectedItem.nombreInvestigacion : ""}
                itemId={""}
              />
              <Filters
                structure={Object.values(columnNames)}
                actions={dispatch}
                filtersState={filters}
                setFilters={setfilters}
               />
              <SectionLabel 
                label="Investigadores Que han Aportado al Laboratorio"
              />
              <hr />
              {
              state.rows.length !== 0 ? 
              <Container className= "card-container">
                  {
                  state.rows.map((colaborador) =>(
                    <ColaboradorCardComponent 
                      colaborador={colaborador}
                      // setSelectedItem={setselectedItem}
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
