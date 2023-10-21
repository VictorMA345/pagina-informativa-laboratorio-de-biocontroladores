import { useState,useEffect } from 'react'
import { SearchBar } from ".."
import Dropdown from 'react-bootstrap/Dropdown';
import "./Filters.css"
interface FiltersProps {
  actions: any,
  dataStructure: Object,
}
export const Filters : React.FC<FiltersProps> = ({dataStructure,actions}) => {
  const [order, setOrder] = useState<string | undefined>(undefined);
  const [searchFor,setSearchFor] = useState<string | undefined>(undefined);
  const [search,setSearch] = useState<string | undefined>("")
  const [searchkeyLabel,setSearchkeyLabel] = useState<string>("No especificado");
  const [error,setError] = useState<string | undefined>(undefined);
  const submitSearch = (e) =>{
    e.preventDefault();
    if (searchkeyLabel !== "No especificado"){
      setError(undefined)
      actions(
        {
          type:"SET_ITEM",
          rows: [],
          cantidad: 5,
          pagina: 1,
          itemCounts: 0,
          filters: {
            order: order ? order === "Descendente" ? "asc": "desc" : "asc" ,
            orderBy: searchFor,
            searchFor: search
          }
      });
    }else{
      setError("Selecciona un campo de búsqueda válido")
    }
  }
  useEffect(() => {
    setOrder(undefined)
  }, []);
  return (
    <div className="filters-container">

      <div className='dropdown-buttons-container'>
        <Dropdown
          className = "order-dropdown"
        >
          <Dropdown.Toggle 
            variant="secondary" 
            id="dropdown-basic"
            value={order}
            >
            {order ? order : "Orden"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item 
              onClick={() =>(setOrder("Descendente"))}
            >
              Descendente
            </Dropdown.Item>
            <Dropdown.Item 
              onClick={() => setOrder("Ascendente")}
            > 
              Ascendente
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className='searchbar-container'>
        <div className='searchbar-input-container'>
          <SearchBar 
            setSearch={setSearch}
            onSearch = {submitSearch}
          />
          {
            error && 
            <div className="error-message">
              {error}
            </div>
          } 
        </div>

        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Buscar por 
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {
              Object.values(dataStructure).map((key,index) => 
                    key.type === "text" || key.type === "selectable-text"  ? 
                    (
                      <Dropdown.Item
                        key = {index}
                        onClick={() => (setSearchFor(key.keyName),setSearchkeyLabel(key.name))}
                      >
                        {key.name}
                      </Dropdown.Item>
                    )
                    :
                    ""
              )
            }
          </Dropdown.Menu>
            {
              <Dropdown.Header>
                {searchkeyLabel}
              </Dropdown.Header>
            }
        </Dropdown>
      </div>
    </div>
  )
}
