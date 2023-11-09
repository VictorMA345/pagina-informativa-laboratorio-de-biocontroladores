import Form from 'react-bootstrap/Form';

interface PermissionsFieldFieldProps {
    label: string;
    value: Record<string, unknown>;
    onChange: (checkBoxKey: string, value: boolean) => void;
}

export const PermissionsField: React.FC<PermissionsFieldFieldProps> = ({ label, value, onChange }) => {
    return (
        <div className="form-field">
            <Form.Label>
                {label}
            </Form.Label>
            {
                Object.entries(value).map(([key, item]) =>
                    <Form.Check
                        type="switch"
                        id={`custom-switch-${key}`}
                        defaultChecked={!!item} 
                        label={
                            key === "create" ? "Crear" :
                            key === "delete" ? "Eliminar" :
                            key === "update" ? "Editar" :
                            key
                        }
                        onChange={(_) => onChange(key, !!item)} 
                    />
                )
            }
        </div>
    );
}
