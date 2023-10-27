export interface ControlBiologico {
  _id: string;
  nombreInvestigacion: string;
  encargados: string[];
  fechaPublicacion: string;
  textoExplicativo: string;
  imagenes: string[];
  documentoDetallado: string;
}

interface FieldProperties {
  name?: string;
  show?: boolean;
  type?: string;
  keyName?: string;
  editable?: boolean;
  defaultValue?: string;
}

export interface ControlBiologicoStructure {
  _id?: FieldProperties;
  nombreInvestigacion: FieldProperties;
  encargados: FieldProperties;
  fechaPublicacion: FieldProperties;
  textoExplicativo: FieldProperties;
  imagenes: FieldProperties;
  documentoDetallado: FieldProperties;
}

export const getControlBiologicoStructure = async (): Promise<ControlBiologicoStructure> => {
    return {
        _id: {
        name: "ID",
        show: false,
        type: "null",
        keyName: "_id",

        },
        nombreInvestigacion: {
        name: "Nombre de la Investigación",
        show: true,
        type: "text",
        keyName: "nombreInvestigacion",

        },
        encargados: {
        name: "Encargados",
        show: true,
        type: "selectable-fetched-list-text",
        keyName: "encargados",
        },
        fechaPublicacion: {
        name: "Fecha de Publicación",
        show: true,
        type: "date",
        keyName: "fechaPublicacion",

        },
        textoExplicativo: {
        name: "Texto Explicativo",
        show: false,
        type: "large-text",
        keyName: "textoExplicativo",

        },
        imagenes: {
        name: "Imágenes",
        show: false,
        type: "multiple-images",
        keyName: "imagenes",

        },
        documentoDetallado: {
        name: "Documento Detallado",
        show: false,
        type: "document",
        keyName: "documentoDetallado",

        },
    };
};