import { Container,Row,Col, Button } from 'react-bootstrap'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState,useEffect } from 'react'
import { DropdownComponent, SearchBar } from '../'
import "./Filters.css"
interface FiltersProps {
    structure: any,
    actions: any,
    filtersState: Object,
    setFilters: React.Dispatch<React.SetStateAction<Object>>,
} 
export const Filters: React.FC<FiltersProps> = ({structure,actions,filtersState,setFilters}) => {
    // Date Dropdown
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const handleDatesChange = (start: Date | undefined, end: Date | undefined) => {
      setStartDate(start || undefined);
      setEndDate(end || undefined);
    };

    // Orden Dropdown
    const [order, setorder] = useState<string>("")
    const orderOptions = ["Ascendente","Descendente"]

    // "Ordenar Por" Dropdown
    const [orderBy, setorderBy] = useState("")
    const [orderByOptions,setorderByOptions] = useState([]);
    const [orderByLabelOptions,setOrderByLabelOptions] = useState([])
    const [selectedOrderByLabelOption,setselectedOrderByLabelOption] = useState<string>("")
    // Search States
    const [search, setsearch] = useState("")

    useEffect(() => {
        const getOrderByOptions = () =>{
            const options = structure
            .filter((field : Object) => field.type === "text")
            .map((field :Object) => field.keyName);
            setorderByOptions(options);
            const labelOptions = structure
            .filter((field : Object) => field.type === "text")
            .map((field :Object) => field.name);
            setOrderByLabelOptions(labelOptions);
        }   
        getOrderByOptions();
    }, [])
    //submit Search 

    useEffect(() => {
        actions({
          type: 'SET_ITEM',
          rows: [],
          cantidad: 6,
          pagina: 1,
          itemCounts: 0,
          filters: filtersState,
        });
      }, [filtersState]);

    const submit = async() =>{
        setFilters(
            {
                order: order ? order === "Descendente" ? "asc": "desc" : "asc" ,
                orderBy: orderBy,
                searchFor: search
            }
        )
    }
    const clearFilters = () =>{
        setorder("");
        setorderBy("")
        setEndDate(undefined);
        setStartDate(undefined)
        setsearch("");
        setselectedOrderByLabelOption("")
    } 
  return (
    <Container className= "filters-container">
         <Row className="filters-header">
        {/* Columna para el campo de fecha "Desde" */}
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='date-container'>
          <label>Desde:</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => handleDatesChange(date, endDate)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
          />
        </Col>
        {/* Columna para el campo de fecha "Hasta" */}
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='date-container'>
          <label>Hasta:</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => handleDatesChange(startDate, date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
          />
        </Col>
        {/* Columna para el campo "Orden" */}
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='dropdown-container'>
          <DropdownComponent
            label='Orden'
            setDropdownState={setorder}
            options={orderOptions}
            boxiconIconName='sort'
            setSelectedLabelOption={setorder}
          />
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} xl={2}  className='dropdown-container'>
            <DropdownComponent
            label="Ordenar Por"
            setDropdownState={setorderBy}
            options={orderByOptions}
            labelOptions={orderByLabelOptions}
            setSelectedLabelOption= {setselectedOrderByLabelOption}
            boxiconIconName="sort"
            />
        </Col>
        <Col>
          <Row className='search-bar-container'>
                <SearchBar searchState={search} setSearchState={setsearch} submit={submit} />
          </Row>
        </Col>

      </Row>
        <hr />
        <Row>
        <Col xs={12} sm={6} md={3} lg={2} xl={2}>
          {startDate && 
            <Container className='order-container'>
              {startDate.toLocaleDateString()}
            </Container>
          }
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} xl={2}>
          {endDate && 
            <Container className='order-container'>
              {endDate.toLocaleDateString()}
            </Container>
          }
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} xl={2}>
          {order !== "" && 
            <Container className='order-container'>
              {order}
            </Container>
          }
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} xl={2}>
          {(selectedOrderByLabelOption !== "" || orderBy !== "") && 
            <Container className='order-container'>
              {selectedOrderByLabelOption}
            </Container>
          }
        </Col>
      </Row>
      <Row>
        {/* Columna para el botón "Limpiar Filtros" */}
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='filter-button-container'>
          <Button onClick={clearFilters} className='clean-filters-button'>
            Limpiar Filtros
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
