export interface Servicio {
    _id: string;
    nombreServicio: string;
    descripcion: string;
    tipoServicio: string;
    telefono: string;
    correoElectronico: string;
    fotosServicio: string[];
    fechaPublicacion: string;
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

export interface ServicioStructure {
    _id?: FieldProperties;
    nombreServicio: FieldProperties;
    descripcion: FieldProperties;
    tipoServicio: FieldProperties;
    telefono: FieldProperties;
    correoElectronico: FieldProperties;
    fotosServicio: FieldProperties;
    fechaPublicacion: FieldProperties;
}

export const getServicioStructure = async (): Promise<ServicioStructure> => {
    return {
        _id: {
            name: "id",
            show: false,
            type: "null",
            keyName: "_id",
            editable: false,
        },
        nombreServicio: {
            name: "Nombre del Servicio",
            show: true,
            type: "text",
            keyName: "nombreServicio",
            editable: true,
        },
        descripcion: {
            name: "Descripción",
            show: true,
            type: "large-text",
            keyName: "descripcion",
            editable: true,
        },
        tipoServicio: {
            name: "Tipo de Servicio",
            show: true,
            type: "text",
            keyName: "tipoServicio",
            editable: true,
        },
        telefono: {
            name: "Teléfono",
            show: true,
            type: "text",
            keyName: "telefono",
            editable: true,
        },
        correoElectronico: {
            name: "Correo Electrónico",
            show: true,
            type: "text",
            keyName: "correoElectronico",
            editable: true,
        },
        fotosServicio: {
            name: "Fotos del Servicio",
            show: false,
            type: "multiple-images",
            keyName: "fotosServicio",
            editable: true,
        },
        fechaPublicacion: {
            name: "Fecha de Publicación",
            show: true,
            type: "date",
            keyName: "fechaPublicacion",
            editable: true,
        },
    };
};