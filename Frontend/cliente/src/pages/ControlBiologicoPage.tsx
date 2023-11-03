import { Container } from "react-bootstrap"
import React, { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        SelectedControlBiologicoSection,ControlBiologicoCardComponent
       } from "../components"
import { useControlBiologicoContext } from "../hooks/useControlBiologico"
import { ControlBiologicoStructure,getControlBiologicoStructure,ControlBiologico } from "../Models"
import { Route,Routes,useLocation  } from "react-router-dom"
import "./page.css"
interface ControlBiologicoPageProps {
  defaultItem: ControlBiologico | undefined;
}
export const ControlBiologicoPage: React.FC<ControlBiologicoPageProps> = ({defaultItem}) => {
    const { state,dispatch } = useControlBiologicoContext();
    const [columnNames, setColumnNames] = useState<ControlBiologicoStructure | undefined>(undefined);
    const [selectedItem, setselectedItem] = useState<ControlBiologico | undefined>(undefined || defaultItem)
    const [filters, setfilters] = useState({})
    
    const location = useLocation();
    useEffect(() => {
      const fetchData = async() =>{
        setColumnNames(await getControlBiologicoStructure())
      }
      fetchData();
    }, [])
  
    useEffect(() => {
      if (location.pathname === "/control_biologico") {
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
          </Route>
  
          <Route 
            path={`/`}
            element={
              <>
              <BreadCrumbsComponent 
                mainSection="control_biologico"
                itemSection={selectedItem ? selectedItem.nombreInvestigacion : ""}
                itemId={""}
              />
              <Filters
                structure={Object.values(columnNames)}
                actions={dispatch}
                filtersState={filters}
                setFilters={setfilters}
               />
              <SectionLabel 
                label="Investigaciones en Control Biológico"
              />
              <hr />
              {
              state.rows.length !== 0 ? 
              <Container className= "card-container">
                  {
                  state.rows.map((control_biologico) =>(
                    <ControlBiologicoCardComponent 
                      item={control_biologico}
                      setSelectedItem={setselectedItem}
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
