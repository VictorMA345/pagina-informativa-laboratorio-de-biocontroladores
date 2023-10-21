import Form from 'react-bootstrap/Form';
import './FormStyles.css'
interface TextInputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}
export const TextModalField: React.FC<TextInputFieldProps> = ({ label, placeholder, value, onChange }) => {
  return (
    <div className="form-field">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        className="form-text"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
