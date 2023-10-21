  export const jsonToFormData = (jsonObject : any) => {
      const formData = new FormData();
      for (const key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
          const value = jsonObject[key];
          if (value instanceof File) {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            if (value.length === 0) {
              formData.append(key, []);
            } else {
              value.forEach((item) => {
                  if (item instanceof File) {
                    formData.append(`${key}`, item);
                  } else {
                    formData.append(`${key}`, item.toString());
                  }
                }
              );
          }
          } else {
            formData.append(key, value ? value.toString() : "");
          }
        }
      }

      return formData;
    };