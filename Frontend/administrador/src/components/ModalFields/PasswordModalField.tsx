import { SetStateAction } from 'react';
import './FormStyles.css'
import Form from 'react-bootstrap/Form';

interface PasswordModalFieldProps {
  label: string;
  placeholder: string;
  value: string;
  password: string;
  onChange: (value: string) => void;
  setPassword: React.Dispatch<SetStateAction<string>>
}

export const PasswordModalField: React.FC<PasswordModalFieldProps> = ({ label, placeholder, value, onChange,setPassword,password }) => {
  return (
    <div className="form-field">
        <Form.Label>
            {label}
        </Form.Label>
        <Form.Control
            className="form-text"
            type="password"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
        <Form.Control
            className="form-text"
            type="password"
            placeholder={`Confirmar ${label.toLowerCase()}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
    </div>
  );
};