import React from 'react'
import { Form,FormControl,Button } from 'react-bootstrap'
import './SearchBar.css'
import { useTranslation } from 'react-i18next'
interface SearchBarProps {
    searchState: string;
    setSearchState: React.Dispatch<React.SetStateAction<string>>;
    submit: () => void;
}
export const SearchBar: React.FC<SearchBarProps> = ({searchState,setSearchState,submit}) => {
  const { t } = useTranslation();
  return (
    <Form className="filters-search-bar d-flex">
        <Button 
        onClick={submit}
        className='search-button'>
            <i className='bx bx-search search-icon'>
            </i>
        </Button>
        <FormControl
            type="text"
            onChange={(event) => setSearchState(event.target.value)}
            placeholder={t('buscar')}
            value={searchState}
            onSubmit={() => submit()}
            className="search-text mr-2"
        />

    </Form>
  )
}
