export interface Enfermedad {
    _id: string;
    enfermedad: string;
    cultivo: string[];
    descripcion: string;
    fitopatogeno: string;
    autor: string[];
    imagenes: string[];
    documento: string[];
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
    editable?: boolean;
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
      editable: false,
    },
    enfermedad: {
      name: "Nombre Común de la enfermedad",
      show: true,
      type: "text",
      keyName: "enfermedad",
      editable: true,
    },
    cultivo: {
      name: "Cultivos",
      show: true,
      type: "list",
      keyName: "cultivo",
      editable: true,
    },
    descripcion: {
      name: "Descripción",
      show: false,
      type: "large-text", 
      keyName: "descripcion",
      editable: true,
    },
    fitopatogeno: {
      name: "Agente Causal",
      show: true,
      type: "text",
      keyName: "fitopatogeno",
      editable: true,
    },  
    autor: {
      name: "Publicador",
      show: true,
      type: "list",
      keyName: "autor",
      editable: true,
    },
    imagenes: {
      name: "Imágenes",
      show: false,
      type: "multiple-images",
      keyName: "imagenes",
      editable: true,
    },
    documento: {
      name: "Documento de la investigación",
      show: false,
      type: "document",
      keyName: "documento",
      editable: true,
    },
    createdAt: {
      name: "Fecha de creación",
      show: true,
      type: "date",
      keyName: "createdAt",
      editable: false,
    },
    updatedAt: {
      name: "Fecha de Edición",
      show: false,
      type: "date",
      keyName: "updatedAt",
      editable: false,
    },
    __v: {
      name: "",
      show: false,
      type: "null",
      keyName: "__v",
      editable: false,
    }
  };
}