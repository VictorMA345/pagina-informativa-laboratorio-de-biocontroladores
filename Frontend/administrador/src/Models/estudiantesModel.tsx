
export interface Estudiante {
  _id: string;
  carneEstudiante: string;
  cedula: string;
  nombreCompleto: string;
  fotoPerfil: string;
  carrera: string;
  investigacion: string;
  genero: string;
  correoElectronico: string;
  anioIngreso: number;
  curriculum: string;
  createdAt: string;
  updatedAt: string;
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

export interface EstudianteStructure {
  _id?: FieldProperties;
  carneEstudiante: FieldProperties;
  cedula: FieldProperties;
  nombreCompleto: FieldProperties;
  fotoPerfil: FieldProperties;
  carrera: FieldProperties;
  investigacion: FieldProperties;
  genero: FieldProperties;
  correoElectronico: FieldProperties;
  anioIngreso: FieldProperties;
  curriculum: FieldProperties;
  createdAt?: FieldProperties;
  updatedAt?: FieldProperties;
  __v?: FieldProperties;
}

export const getEstudianteStructure = async (): Promise<EstudianteStructure> => {
  return {
    _id: {
      name: "ID",
      show: false,
      type: "null",
      keyName: "_id",
      editable: false,
    },
    carneEstudiante: {
      name: "Carne del Estudiante",
      show: true,
      type: "text",
      keyName: "carneEstudiante",
      editable: true,
    },
    cedula: {
      name: "Cédula",
      show: true,
      type: "text",
      keyName: "cedula",
      editable: true,
    },
    nombreCompleto: {
      name: "Nombre del Estudiante",
      show: true,
      type: "text",
      keyName: "nombreCompleto",
      editable: true,
    },
    fotoPerfil: {
      name: "Foto de Perfil",
      show: false,
      type: "single-image",
      keyName: "fotoPerfil",
      editable: true,
    },
    carrera: {
      name: "Carrera",
      show: true,
      type: "text",
      keyName: "carrera",
      editable: true,
    },
    investigacion: {
      name: "Investigación",
      show: false,
      type: "text",
      keyName: "investigacion",
      editable: true,
    },
    genero: {
      name: "Género",
      show: true,
      type: "selectable-text",
      keyName: "genero",
      editable: true,
      choices: ['Masculino','Femenino','Prefiero no decir']
    },
    correoElectronico: {
      name: "Correo Electrónico",
      show: false,
      type: "text",
      keyName: "correoElectronico",
      editable: true,
    },
    anioIngreso: {
      name: "Año de Ingreso",
      show: false,
      type: "text",
      keyName: "anioIngreso",
      editable: true,
    },
    curriculum: {
      name: "Currículum",
      show: false,
      type: "document",
      keyName: "curriculum",
      editable: true,
    },
    createdAt: {
      name: "Fecha de Creación",
      show: false,
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