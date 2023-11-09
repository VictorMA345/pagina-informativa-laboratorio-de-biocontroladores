import React from "react";
import Dropdown from 'react-bootstrap/Dropdown'; 
import Form from 'react-bootstrap/Form';
import './FormStyles.css';

interface SelectableListTextFieldProps {
  label: string;
  keyName: string;
  choices: string[];
  selectedValue: string;
  onSelect: (value: string, keyName: string, index: number) => void;
  onRemove: (index: number, keyName: string) => void;
  showForm: Record<string, any>;
}
export const SelectableListTextField: React.FC<SelectableListTextFieldProps> = ({ label,keyName, choices, onSelect, onRemove, showForm }) => {


  return (
    <div className="tags-input">
      <Form.Label>{label}</Form.Label>
      <Dropdown key={keyName}>
        <Dropdown.Toggle variant="secondary" id={`dropdown-${keyName}`}>
          Seleccionar {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {choices.map((item, index) => 
          (
            <Dropdown.Item
              key={index}
              onClick={() => onSelect(item, keyName, index)}
            >
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      <ul id="tags">
        {Array.isArray(showForm[keyName]) &&
          showForm[keyName].map((tag : any, index : any) => (
            <li key={index} className="tag">
              <span className="tag-title">{tag}</span>
              <span
                className="tag-close-icon"
                onClick={() => onRemove(index, keyName)}
              >
                x
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
};
