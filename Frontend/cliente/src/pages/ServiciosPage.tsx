import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        ServiceCardComponent,LoadingSpinner,PaginationComponent,NoResultsLabel,
        SelectedServiceSection, NotFoundComponent
       } from "../components"
import { useServicioContext } from "../hooks/useService"
import { ServicioStructure,getServicioStructure,Servicio } from "../Models"
import { Route,Routes,useLocation  } from "react-router-dom"
import { useTranslation } from 'react-i18next'
import "./page.css"
export const ServiciosPage = () => {
  const { state,dispatch } = useServicioContext();
  const [columnNames, setColumnNames] = useState<ServicioStructure | undefined>(undefined);
  const [selectedItem, setselectedItem] = useState<Servicio | undefined>(undefined)

  const [filters, setfilters] = useState({})
  const { t } = useTranslation();
  const location = useLocation();
  useEffect(() => {
    const fetchData = async() =>{
      setColumnNames(await getServicioStructure())
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (location.pathname === "/servicios") {
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
                  mainSection="servicios"
                  itemSection={selectedItem ? selectedItem.nombreServicio : ""}
                  itemId={selectedItem ? selectedItem._id : ""}
                />
                <SectionLabel 
                  label={ selectedItem?.nombreServicio || ""}
                />
                <SelectedServiceSection 
                  selecteditem={selectedItem}
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
              mainSection="servicios"
              itemSection={selectedItem ? selectedItem.nombreServicio : ""}
              itemId={""}
            />
            <Filters
              structure={Object.values(columnNames)}
              actions={dispatch}
              filtersState={filters}
              setFilters={setfilters}
             />
            <SectionLabel 
              label={t('servicios_brindados')}
            />
            <hr />
            {
            state.rows.length !== 0 ? 
            <Container className= "card-container">
                {
                state.rows.map((servicio) =>(
                  <ServiceCardComponent 
                    servicio={servicio}
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
