import Form from 'react-bootstrap/Form';

interface ListFieldProps {
  label: string;
  placeholder: string;
  items: string[];
  onAddItem: (item: string, event: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveItem: (index: number) => void;
}

export const ListModalField: React.FC<ListFieldProps> = ({ label, placeholder, items, onAddItem, onRemoveItem }) => {
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement; 
      onAddItem(target.value, event);
      target.value = '';
    }
  };

  return (
    <div className="form-field">
      <Form.Label>{label}</Form.Label>
      <div className="tags-input">
        <input
          className="form-list-input"
          type="text"
          onKeyUp={handleKeyUp}
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
