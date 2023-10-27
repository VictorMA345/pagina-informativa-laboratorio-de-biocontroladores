
export interface Colaborador {
    _id: string;
    nombreCompleto: string;
    listaEstudios: string[];
    proyectosColaborados: string[];
    fotoPerfil: string;
    descripcion: string;
    createdAt: {
      $date: string;
    };
    updatedAt: {
      $date: string;
    };
    __v: number;
  }

interface FieldProperties {
  name?: string;
  show?: boolean;
  type?: string;
  keyName?: string;
  editable?: boolean;
  defaultValue?: string;
  choices?: string[];   
  choices_id?: string[];   
}

export interface ColaboradorStructure {
  _id?: FieldProperties;
  nombreCompleto: FieldProperties;
  listaEstudios: FieldProperties;
  proyectosColaborados: FieldProperties;
  fotoPerfil: FieldProperties;
  descripcion: FieldProperties;
  createdAt?: FieldProperties;
  updatedAt?: FieldProperties;
  __v?: FieldProperties;
}

export const getColaboradorStructure = async (): Promise<ColaboradorStructure> => {
  return {
    _id: {
      name: "ID",
      show: false,
      type: "null",
      keyName: "_id",
    },
    nombreCompleto: {
      name: "Nombre del Colaborador",
      show: true,
      type: "text",
      keyName: "nombreCompleto",
    },
    listaEstudios: {
      name: "Lista de Estudios",
      show: true,
      type: "list",
      keyName: "listaEstudios",
    },
    proyectosColaborados: {
      name: "Proyectos Colaborados",
      show: true,
      type: "selectable-fetched-list-text",
      keyName: "proyectosColaborados",
    },
    fotoPerfil: {
      name: "Foto de Perfil",
      show: false,
      type: "single-image",
      keyName: "fotoPerfil",
    },
    descripcion: {
      name: "Descripción",
      show: false,
      type: "large-text",
      keyName: "descripcion",
    },
    createdAt: {
      name: "Fecha de Creación",
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
    },
  };
};