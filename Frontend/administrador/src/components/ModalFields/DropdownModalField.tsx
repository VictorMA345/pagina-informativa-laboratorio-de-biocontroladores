import './FormStyles.css'
import Dropdown from 'react-bootstrap/Dropdown';
import { Form } from 'react-bootstrap';
interface SelectTextDropdownProps {
  label: string;
  choices: string[];
  choices_id: string[];
  selectedValue: string | undefined;
  onSelect: (value: string,id?: string) => void;
}

export const DropdownModalField: React.FC<SelectTextDropdownProps> = ({
  label,
  choices,
  choices_id,
  selectedValue,
  onSelect,
}) => {
  return (  
    <div className="form-field">
      <Form.Label>
        {label}
      </Form.Label>
      <Dropdown>
        <Dropdown.Toggle variant="secondary" id={`dropdown-${label}`}>
          Seleccionar {label}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {choices.map((item, index) => (
            <Dropdown.Item
              key={index}
              onClick={() => onSelect(item,choices_id && choices_id[index])}
            >
              {item}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
      {selectedValue && (
        <Form.Label style={{ "marginTop": "3%" }}>
          {selectedValue}
        </Form.Label>
      )}
    </div>
  );
};



