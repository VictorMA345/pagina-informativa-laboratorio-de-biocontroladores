export interface Enfermedad {
    _id: string;
    enfermedad: string;
    cultivo: string[];
    descripcion: string;
    fitopatogeno: string;
    autor: string[];
    imagenes: string[];
    documento: string;
    createdAt: {
      $date: string;
    };
    updatedAt: {
      $date: string;
    };
    __v: number;
  }

  export interface EnfermedadStructure {
    _id?: FieldProperties;
    enfermedad?: FieldProperties;
    cultivo?: FieldProperties;
    descripcion?: FieldProperties;
    fitopatogeno?: FieldProperties;
    autor?: FieldProperties;
    imagenes?: FieldProperties;
    documento?: FieldProperties;
    createdAt?: FieldProperties;
    updatedAt?: FieldProperties;
    __v?: FieldProperties;
  }
  
  interface FieldProperties {
    name?: string;
    show?: boolean;
    type?: string;
    keyName?: string;
    defaultValue?: string;
    choices?: string[];
  }

export const getEnfermedadStructure= () : EnfermedadStructure => {
  return {
    _id: {
      name: "id",
      show: false,
      type: "null",
      keyName: "_id",
    },
    enfermedad: {
      name: "Nombre Común de la enfermedad",
      show: true,
      type: "text",
      keyName: "enfermedad",
          },
    cultivo: {
      name: "Cultivos",
      show: true,
      type: "list",
      keyName: "cultivo",
          },
    descripcion: {
      name: "Descripción",
      show: false,
      type: "large-text", 
      keyName: "descripcion",
          },
    fitopatogeno: {
      name: "Agente Causal",
      show: true,
      type: "text",
      keyName: "fitopatogeno",
          },  
    autor: {
      name: "Publicador",
      show: true,
      type: "list",
      keyName: "autor",
          },
    imagenes: {
      name: "Imágenes",
      show: false,
      type: "multiple-images",
      keyName: "imagenes",
          },
    documento: {
      name: "Documento de la investigación",
      show: false,
      type: "document",
      keyName: "documento",
          },
    createdAt: {
      name: "Fecha de creación",
      show: true,
      type: "date",
      keyName: "createdAt",
      
    },
    updatedAt: {
      name: "Fecha de Edición",
      show: false,
      type: "date",
      keyName: "updatedAt",
      
    },
    __v: {
      name: "",
      show: false,
      type: "null",
      keyName: "__v",
      
    }
  };
}