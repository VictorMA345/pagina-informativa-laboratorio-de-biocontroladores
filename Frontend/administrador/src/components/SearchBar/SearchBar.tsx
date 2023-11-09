import "./SearchBar.css";
import { MDBCol, MDBIcon } from "mdbreact";
import React from 'react';
interface SearchBarProps {
    setSearch: React.Dispatch<React.SetStateAction<string | undefined>>,
    onSearch: (e: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => void,
}

export const SearchBar: React.FC<SearchBarProps> = ({ setSearch, onSearch }) => {
    const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };
    return (
        <MDBCol md="6">
            <form
                className="form-inline"
                onSubmit={onSearch}
            >
                <MDBIcon className="search-bar-icon" icon="search" onClick={onSearch} />
                <input
                    className="form-control form-control-sm ml-3 w-75"
                    onChange={onChangeSearch}
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                />
            </form>
        </MDBCol>
    );
}
