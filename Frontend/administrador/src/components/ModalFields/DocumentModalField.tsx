import { Form } from 'react-bootstrap';
import './FormStyles.css'
interface DocumentModalFieldProps {
  label: string;
  keyName: string;
  formData: any;
  onChange: (value: File) => void;
}
export const DocumentModalField: React.FC<DocumentModalFieldProps> = ({ label, keyName, formData, onChange }) => {
  const openWindow = () =>{
    window.open(formData[keyName]);
  }
  return (
    <>
      <Form.Label>
        {`Ingrese ${label}`}
      </Form.Label>
      <Form.Control 
        className="form-document" 
        type="file" 
        onChange={(e) => onChange(e.target.files[0])} 
        />
            {
              formData[keyName] && formData[keyName].name ? 
              <Form.Label>  
                { formData[keyName].name }
              </Form.Label>
              : 
              <Form.Label className='form-label-field' onClick={openWindow}>  
                { formData[keyName] }
              </Form.Label>
            }

    </>
  );
}