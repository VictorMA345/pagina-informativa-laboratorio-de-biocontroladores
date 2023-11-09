import { Container,Row,Col, Button } from 'react-bootstrap'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import React, { useState,useEffect } from 'react'
import { DropdownComponent, SearchBar } from '../'
import { useTranslation } from 'react-i18next'
import "./Filters.css"
interface FiltersProps {
    structure: any,
    actions: any,
    filtersState: Object,
    setFilters: React.Dispatch<React.SetStateAction<Object>>,
} 
interface FieldProperties {
  name?: string;
  show?: boolean;
  type?: string;
  keyName?: string;
  editable?: boolean;
  defaultValue?: string;
}

export const Filters: React.FC<FiltersProps> = ({structure,actions,filtersState,setFilters}) => {
    // Date Dropdown
    const [startDate, setStartDate] = useState<Date | undefined>(undefined);
    const [endDate, setEndDate] = useState<Date | undefined>(undefined);
    const handleDatesChange = (start: Date | undefined, end: Date | undefined) => {
      setStartDate(start || undefined);
      setEndDate(end || undefined);
    };

    // Hook de traducción
    const { t } = useTranslation();

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
            .filter((field : FieldProperties) => field.type === "text")
            .map((field :FieldProperties) => field.keyName);
            setorderByOptions(options);
            const labelOptions = structure
            .filter((field : FieldProperties) => field.type === "text")
            .map((field :FieldProperties) => field.name);
            setOrderByLabelOptions(labelOptions);
        }   
        getOrderByOptions();
    }, [])

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
      const formatDate = (date : Date | undefined) => {
        if (!date){
          return ""
        }
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
      };
    const submit = async() =>{
        setFilters(
            {
                order: order ? order === "Descendente" ? "asc": "desc" : "asc" ,
                orderBy: orderBy,
                searchFor: search,  
                startDate: formatDate(startDate),
                endDate: formatDate(endDate)
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
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='date-container'>
          <label>{t('desde')}</label>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => handleDatesChange(date, endDate)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd" 
          />
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='date-container'>
          <label>{t('hasta')}</label>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => handleDatesChange(startDate, date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd" 
          />
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='dropdown-container'>
          <DropdownComponent
            label={t('orden')}
            setDropdownState={setorder}
            options={orderOptions}
            boxiconIconName='sort'
            setSelectedLabelOption={setorder}
          />
        </Col>
        <Col xs={12} sm={6} md={3} lg={2} xl={2}  className='dropdown-container'>
            <DropdownComponent
            label={t('buscar_por')}
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
        <Col xs={12} sm={6} md={3} lg={2} xl={2} className='filter-button-container'>
          <Button onClick={clearFilters} className='clean-filters-button'>
              {t('limpiar_filtros')}
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
