import { Form } from 'react-bootstrap';
import './FormStyles.css';
interface DocumentModalFieldProps {
  label: string;
  keyName: string;
  formData: any;
  onChange: (value: File) => void;
}
export const DocumentModalField: React.FC<DocumentModalFieldProps> = ({ label, keyName, formData, onChange }) => {
  const openWindow = () => {
    window.open(formData[keyName]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };
  return (
    <>
      <Form.Label>{`Ingrese ${label}`}</Form.Label>
      <Form.Control
        className="form-document"
        type="file"
        onChange={handleFileChange}
        accept=".pdf"
      />

      {formData[keyName] && formData[keyName].name ? (
        <Form.Label>{formData[keyName].name}</Form.Label>
      ) : (
        <Form.Label className='form-label-field' onClick={openWindow}>
          {formData[keyName]}
        </Form.Label>
      )}
    </>
  );
};
