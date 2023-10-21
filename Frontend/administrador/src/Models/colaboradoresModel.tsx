import { getAllProyectoNames } from "../services";

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
  const proyectosNombres = await getAllProyectoNames();
  return {
    _id: {
      name: "ID",
      show: false,
      type: "null",
      keyName: "_id",
      editable: false,
    },
    nombreCompleto: {
      name: "Nombre del Colaborador",
      show: true,
      type: "text",
      keyName: "nombreCompleto",
      editable: true,
    },
    listaEstudios: {
      name: "Lista de Estudios",
      show: true,
      type: "list",
      keyName: "listaEstudios",
      editable: true,
    },
    proyectosColaborados: {
      name: "Proyectos Colaborados",
      show: true,
      type: "selectable-fetched-list-text",
      keyName: "proyectosColaborados",
      editable: true,
      choices: proyectosNombres.map((proyecto) => proyecto.nombre),
      choices_id: proyectosNombres.map((proyecto) => proyecto.id),
    },
    fotoPerfil: {
      name: "Foto de Perfil",
      show: false,
      type: "single-image",
      keyName: "fotoPerfil",
      editable: true,
    },
    descripcion: {
      name: "Descripción",
      show: false,
      type: "large-text",
      keyName: "descripcion",
      editable: true,
    },
    createdAt: {
      name: "Fecha de Creación",
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
    },
  };
};