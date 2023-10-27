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
        },
        nombreServicio: {
            name: "Nombre del Servicio",
            show: true,
            type: "text",
            keyName: "nombreServicio",
        },
        descripcion: {
            name: "Descripción",
            show: true,
            type: "large-text",
            keyName: "descripcion",
        },
        tipoServicio: {
            name: "Tipo de Servicio",
            show: true,
            type: "text",
            keyName: "tipoServicio",
        },
        telefono: {
            name: "Teléfono",
            show: true,
            type: "text",
            keyName: "telefono",
        },
        correoElectronico: {
            name: "Correo Electrónico",
            show: true,
            type: "text",
            keyName: "correoElectronico",
        },
        fotosServicio: {
            name: "Fotos del Servicio",
            show: false,
            type: "multiple-images",
            keyName: "fotosServicio",
        },
        fechaPublicacion: {
            name: "Fecha de Publicación",
            show: true,
            type: "date",
            keyName: "fechaPublicacion",
        },
    };
};