import { Form } from 'react-bootstrap'
import './FormStyles.css'

interface DateModalFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
  }
export const DateModalField : React.FC<DateModalFieldProps>= ({label, value ,onChange}) => {
  const formattedDate = value ? value.split('T')[0] : ''; 
  return (
    <div className="form-field">
        <Form.Label>
            {label}
        </Form.Label>
        <Form.Control 
            className="form-date" 
            type="date"
            value={formattedDate}
            onChange={(e) => onChange(e.target.value)}
        >
        </Form.Control>
    </div>
  )
}
