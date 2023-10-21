  import React, { useState, useEffect } from 'react';
  import { Button, Form } from 'react-bootstrap';
  import Image from 'react-bootstrap/Image';

  interface MultiImageUploadModalFieldModalFieldProps {
    label: string;
    keyName: string;
    formData: any;
    onChange: (value: any) => void;
  }

  export const MultiImageUploadModalField: React.FC<MultiImageUploadModalFieldModalFieldProps> = ({
    label,
    keyName,
    formData,
    onChange,
  }) => {
    const [images, setImages] = useState<any[]>([]);
    useEffect(() => {
      if (formData && formData[keyName] !== undefined) {
        const imagesData = formData[keyName];
        setImages(imagesData);
      }
    }, [formData, keyName]);
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const fileList = event.target.files;
      if (fileList && fileList.length > 0) {
        const newImages = Array.from(fileList);
        setImages([...images, ...newImages]);
        onChange([...images, ...newImages]);
      }
    };

    const removeImage = (index: number) => {
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);
      onChange(updatedImages);
    };

    return (
      <div className="form-document">
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type="file"
          onChange={handleImageChange}
          multiple
        />
        <div className="image-preview-container">
          {images.map((image: any, index: number) => (
            <div className="image-preview" key={index}>
              <div>
              {typeof image === 'string' ? (
                <Image
                  className='form-image'
                  src={image}
                  alt={label}
                  rounded
                />
              ) : (
                <Image
                  className='form-image'
                  src={URL.createObjectURL(image)}
                  alt={label}
                  rounded
                />
              )}
              <Button
                  variant='secondary'
                  className="remove-image-button"
                  onClick={() => removeImage(index)}
              >
              <i className="bx bx-minus" >
                </i>
              </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
