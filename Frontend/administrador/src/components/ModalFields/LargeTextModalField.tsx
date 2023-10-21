import { Form } from "react-bootstrap";
interface LargeTextModalFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
  }

export const LargeTextModalField : React.FC<LargeTextModalFieldProps>= ({ label, placeholder, value, onChange }) => {
  return (
    <div className="form-field">
        <Form.Label>
            {label}
        </Form.Label>
        <Form.Control
            className="form-large-text" 
            as="textarea"
            rows={7}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
  )
}
