import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import './FormStyles.css'
interface SingleImageUploadModalFieldProps {
  label: string;
  keyName: string;
  formData: any;
  onChange: (value: string) => void;
}

export const SingleImageUploadModalField: React.FC<SingleImageUploadModalFieldProps> = ({
  label,
  keyName,
  formData,
  onChange,
}) => {
  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    const fileURL = formData[keyName];
    if (fileURL && typeof fileURL === "string" && fileURL.startsWith('https://drive.google.com/uc?id=')) {
      setImageURL(fileURL);
    } else {
      setImageURL(null);
    }
  }, [formData, keyName]);

  const handleRemoveImage = () => {
    onChange("");
    setImageURL(null);
  };  

  return (
    <div className="form-image">
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="file"
        onChange={(event) => {
          onChange(event.target.files[0]);
        }}
      />
      {imageURL ? (
        <div className="image-preview" style={{ position: 'relative' }}>
          <Image
            className="form-image"
            src={imageURL}
            alt={label}
            rounded
          />
          <button
            onClick={handleRemoveImage}
            className="remove-image-button"
          >
            <span role="img" aria-label="Eliminar imagen"> X </span>
          </button>
        </div>
      ) : (
        formData[keyName] && typeof formData[keyName] !== "string" ? (
          <div className="image-preview" style={{ position: 'relative' }}>
            <Image
              className="form-image"
              src={URL.createObjectURL(formData[keyName])}
              alt={label}
              rounded
            />
            <Button
              onClick={handleRemoveImage}
              className="remove-image-button"
            >
              <i className="bx bx-no-entry " >
              </i>
            </Button>
          </div>
        ) : (
          ""
        )
      )}
    </div>
  );
};
