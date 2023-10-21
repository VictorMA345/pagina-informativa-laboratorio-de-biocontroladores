import "./SearchBar.css"
import { MDBCol, MDBIcon } from "mdbreact";
interface SearchBarProps {
    setSearch : React.Dispatch<React.SetStateAction<string | undefined>>,
    onSearch: (e: any) => void,
}
export const SearchBar: React.FC<SearchBarProps> = ({ setSearch,onSearch }) => {
    const onChangeSearch = (e) =>{
        setSearch(e.target.value)
    }
    return (
        <MDBCol md="6">
            <form 
                className="form-inline" 
                onSubmit={onSearch}
            >
                <MDBIcon className="search-bar-icon" icon="search" onClick={onSearch}/>
                <input 
                    className="form-control form-control-sm ml-3 w-75" 
                    onChange={(event) => onChangeSearch(event)}
                    type="text" 
                    placeholder="Search" 
                    aria-label="Search" 
                />
            </form>
        </MDBCol>   
    )
}
