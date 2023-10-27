
export interface Estudiante {
    _id: string;
    carneEstudiante: string;
    cedula: string;
    nombreCompleto: string;
    fotoPerfil: string;
    carrera: string;
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
      },
      carneEstudiante: {
        name: "Carne del Estudiante",
        show: true,
        type: "text",
        keyName: "carneEstudiante",
      },
      cedula: {
        name: "Cédula",
        show: true,
        type: "text",
        keyName: "cedula",
      },
      nombreCompleto: {
        name: "Nombre del Estudiante",
        show: true,
        type: "text",
        keyName: "nombreCompleto",
      },
      fotoPerfil: {
        name: "Foto de Perfil",
        show: false,
        type: "single-image",
        keyName: "fotoPerfil",
      },
      carrera: {
        name: "Carrera",
        show: true,
        type: "text",
        keyName: "carrera",
      },
      genero: {
        name: "Género",
        show: true,
        type: "selectable-text",
        keyName: "genero",
      },
      correoElectronico: {
        name: "Correo Electrónico",
        show: true,
        type: "text",
        keyName: "correoElectronico",
      },
      anioIngreso: {
        name: "Año de Ingreso",
        show: true,
        type: "text",
        keyName: "anioIngreso",
      },
      curriculum: {
        name: "Currículum",
        show: false,
        type: "document",
        keyName: "curriculum",
      },
      createdAt: {
        name: "Fecha de Creación",
        show: true,
        type: "date",
        keyName: "createdAt",

      },
      updatedAt: {
        name: "Fecha de Edición",
        show: true,
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