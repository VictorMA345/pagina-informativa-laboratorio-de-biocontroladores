import { Container } from "react-bootstrap"
import { useState,useEffect } from "react"
import { BreadCrumbsComponent,Filters,SectionLabel,
        LoadingSpinner,PaginationComponent,NoResultsLabel,
        SelectedEnfermedadSection,EnfermedadCardComponent
       } from "../components"
import { useEnfermedadContext } from "../hooks/useEnfermedad"
import { EnfermedadStructure,getEnfermedadStructure,Enfermedad } from "../Models"
import { Route,Routes,useLocation  } from "react-router-dom"
import "./page.css"
interface EnfermedadPageProps {
  defaultItem: Enfermedad | undefined;
}
export const EnfermedadPage: React.FC<EnfermedadPageProps> = ({defaultItem}) => {
  const { state,dispatch } = useEnfermedadContext();
  const [columnNames, setColumnNames] = useState<EnfermedadStructure | undefined>(undefined);
  const [selectedItem, setselectedItem] = useState<Enfermedad | undefined>(undefined || defaultItem)

  const [filters, setfilters] = useState({})
  
  const location = useLocation();
  useEffect(() => {
    const fetchData = async() =>{
      setColumnNames(await getEnfermedadStructure())
    }
    fetchData();
  }, [])

  useEffect(() => {
    if (location.pathname === "/fitopatogenos") {
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
                  mainSection="fitopatogenos"
                  itemSection={selectedItem ? selectedItem.enfermedad : ""}
                  itemId={selectedItem ? selectedItem._id : ""}
                />
                <SectionLabel 
                  label={ selectedItem?.enfermedad || ""}
                />
                <SelectedEnfermedadSection 
                  enfermedad={selectedItem}
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
              mainSection="fitopatogenos"
              itemSection={selectedItem ? selectedItem.enfermedad : ""}
              itemId={""}
            />
            <Filters
              structure={Object.values(columnNames)}
              actions={dispatch}
              filtersState={filters}
              setFilters={setfilters}
             />
            <SectionLabel 
              label="Fitopatógenos"
            />
            <hr />
            {
            state.rows.length !== 0 ? 
            <Container className= "card-container">
                {
                state.rows.map((enfermedad) =>(
                  <EnfermedadCardComponent 
                    item={enfermedad}
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
