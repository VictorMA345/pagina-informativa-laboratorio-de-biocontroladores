import { getAllProyectoNames,getAllRolNames } from "../services";

export interface Miembro {
    _id: string;
    nombreCompleto: string;
    rolLaboratorio: string;
    correo: string;
    contrasena: string;
    telefono: string;
    genero: string;
    fotoPerfil: string;
    areaEspecializacion: string[];
    proyectosParticipacion: string[];
    curriculumDocumento: string;
    resumen : string;
    fechaNacimiento: Date;
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

  export interface MiembroStructure {
    _id?: FieldProperties;
    nombreCompleto: FieldProperties;
    rolLaboratorio: FieldProperties;
    correo: FieldProperties;
    contrasena: FieldProperties;
    telefono: FieldProperties;
    genero: FieldProperties;
    fotoPerfil: FieldProperties;
    areaEspecializacion: FieldProperties;
    proyectosParticipacion: FieldProperties;
    curriculumDocumento: FieldProperties;
    resumen : FieldProperties;
    fechaNacimiento: FieldProperties;
    createdAt?: FieldProperties;
    updatedAt?: FieldProperties;
    __v?: FieldProperties;
  }

export const getMiembroStructure = async() : Promise<MiembroStructure> => {
  const proyectosNombres = await getAllProyectoNames();
  const rolNombres = await getAllRolNames();
  return {
    _id: {
      name: "id",
      show: false,
      type: "null",
      keyName: "_id",
      editable: false,
    },
    nombreCompleto: {
      name: "Nombre Del Miembro",
      show: true,
      type: "text",
      keyName: "nombreCompleto",
      editable: true,
    },
    rolLaboratorio: {
      name: "Rol del Miembro",
      show: true,
      type: "selectable-fetched-text",
      keyName: "rolLaboratorio",
      editable: true,
      choices: await rolNombres.map((rol) => rol.role_name),
      choices_id: await rolNombres.map((rol) => rol.id) 
    },
    correo: {
      name: "Correo Electrónico",
      show: true,
      type: "text", 
      keyName: "correo",
      editable: true,
    },
    contrasena: {
      name: "Contraseña",
      show: false,
      type: "password",
      keyName: "contrasena",
      editable: true,
    },
    telefono: {
      name: "Número de teléfono",
      show: true,
      type: "text",
      keyName: "telefono",
      editable: true,
    },
    genero: {
      name: "Género",
      show: false,
      type: "selectable-text",
      keyName: "genero",
      editable: true,
      choices: ["Masculino","Femenino","Prefiero no decir"]
    },
    fotoPerfil: {
      name: "Foto de perfil",
      show: false,
      type: "single-image",
      keyName: "fotoPerfil",
      editable: true,
    },
    areaEspecializacion: {
        name: "Area de especialización",
        show: false,
        type: "list",
        keyName: "areaEspecializacion",
        editable: true,
    },
    proyectosParticipacion: {
        name: "Proyectos participados",
        show: false,
        type: "selectable-fetched-list-text",
        keyName: "proyectosParticipacion",
        editable: false,
        choices:  proyectosNombres.map((proyecto) => proyecto.nombre),
        choices_id: proyectosNombres.map((proyecto) => proyecto.id)
    },
    curriculumDocumento: {
        name: "Curriculum",
        show: false,
        type: "document",
        keyName: "curriculumDocumento",
        editable: true,
    },
    resumen: {
        name: "Resumen",
        show: false,
        type: "large-text",
        keyName: "resumen",
        editable: true,
    },
    fechaNacimiento: {
        name: "Fecha de nacimiento",
        show: true,
        type: "date",
        keyName: "fechaNacimiento",
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