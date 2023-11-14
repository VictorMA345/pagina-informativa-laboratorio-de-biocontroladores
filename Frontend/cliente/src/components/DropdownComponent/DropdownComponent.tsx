import React from 'react'
import { Dropdown } from 'react-bootstrap';
import './DropdownComponent.css'
interface DropdownComponentProps{
    label: string;
    options: string[];
    labelOptions?: string[];
    setDropdownState: React.Dispatch<React.SetStateAction<string>>;
    setSelectedLabelOption:React.Dispatch<React.SetStateAction<string>>;
    boxiconIconName: string;
}
export const DropdownComponent: React.FC<DropdownComponentProps> = ({label ,options,labelOptions,setDropdownState,setSelectedLabelOption,boxiconIconName}) => {
  return (
    <Dropdown className='filter-dropdown'>
        <Dropdown.Toggle className='filter-dropdown-toggle' id="dropdown-basic">
        <i className={`bx bx-${boxiconIconName} dropdown-button-icon`}  >
        </i>    
            {label}
        </Dropdown.Toggle>
        <Dropdown.Menu >
        {options && options.map((item,index) =>(
             <Dropdown.Item onClick = {() => (setDropdownState(item),setSelectedLabelOption(labelOptions ? labelOptions[index]: item))}key = {index}>
                { labelOptions ? labelOptions[index]: item}
             </Dropdown.Item>
        )
        )}
        </Dropdown.Menu>
    </Dropdown>
  )
}
