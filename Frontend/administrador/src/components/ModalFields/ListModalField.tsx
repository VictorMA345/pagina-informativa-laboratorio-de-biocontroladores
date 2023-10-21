
import Form from 'react-bootstrap/Form';

interface ListFieldProps {
  label: string;
  placeholder: string;
  items: string[];
  onAddItem: (item: string,event :any) => void;
  onRemoveItem: (index: number) => void;
}

export const ListModalField: React.FC<ListFieldProps> = ({ label, placeholder, items, onAddItem, onRemoveItem }) => {
  return (
    <div className="form-field">
        <Form.Label>  
            {label}
        </Form.Label>
        <div className="tags-input">
            <input
            className="form-list-input"
            type="text"
            onKeyUp={(event) => event.key === "Enter" ? onAddItem(event.target.value,event) : null}
            placeholder={placeholder}
            />
            <ul id="tags">
            {items.map((item, index) => (
                <li key={index} className="tag">
                <span className='tag-title'>{item}</span>
                <span className='tag-close-icon' onClick={() => onRemoveItem(index)}>x</span>
                </li>
            ))}
            </ul>
        </div>
    </div>
  );
};

