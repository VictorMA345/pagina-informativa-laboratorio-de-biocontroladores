export interface Rol {
  _id: string;
  role_name: string;
  descripcion: string;
  general_permissions: {
    create: boolean;
    delete: boolean;
    update: boolean;
  };
  permissions: {
    colaboradores: boolean;
    control_biologico: boolean;
    enfermedades: boolean;
    estudiantes: boolean;
    miembros: boolean;
    noticias: boolean;
    proyectos: boolean;
    servicios: boolean;
    tesis: boolean;
    rol: boolean;
  };
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

export interface RolStructure {
  _id?: FieldProperties;
  role_name?: FieldProperties;
  descripcion?: FieldProperties;
  general_permissions?:FieldProperties;
  permissions?: FieldProperties;
}

export const getRolStructure = async (): Promise<RolStructure> => {
  return {
    _id: {
      name: "ID",
      show: false,
      type: "null",
      keyName: "_id",
      editable: false,
    },
    role_name: {
      name: "Nombre del Rol",
      show: true,
      type: "text",
      keyName: "role_name",
      editable: true,
    },
    descripcion: {
      name: "Descripción",
      show: true,
      type: "large-text",
      keyName: "descripcion",
      editable: true,
    },
    general_permissions: {
        name: "Permisos Generales",
        show: false,
        type: "general-permissions",
        keyName: "general_permissions",
        editable: true,
    },
    permissions: {
        name: "Permisos de Modulos",
        show: false,
        type: "permissions",
        keyName: "permissions",
        editable: true,
    },
  };
};
