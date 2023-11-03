import Form from 'react-bootstrap/Form';
interface PermissionsFieldFieldProps {
    label: string;
    value: any;
    onChange: (checkBoxKey: string,value:boolean) => void;
}
export const PermissionsField : React.FC<PermissionsFieldFieldProps> = ({label,value,onChange}) => {
    return (
        <div className="form-field">
            <Form.Label>
                {label}
            </Form.Label>
            {
                Object.values(value).map((item,index) =>
                    <Form.Check 
                        type="switch"
                        id="custom-switch"
                        defaultChecked={item}
                        label={Object.keys(value)[index] === "create" &&  "Crear" ||
                               Object.keys(value)[index] === "delete" &&  "Eliminar" ||
                               Object.keys(value)[index] === "update" &&  "Editar" ||
                               Object.keys(value)[index] }
                        onChange={(e) => onChange(Object.keys(value)[index],item)}
                    />
                    
                )
            }
        </div>
    )
}
