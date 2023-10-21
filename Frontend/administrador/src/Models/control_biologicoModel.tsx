import { getAllMiembrosNames } from "../services";
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
  choices?: string[];   
  choices_id?: string[];   
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
    const miembrosNames = await getAllMiembrosNames();
    return {
        _id: {
        name: "ID",
        show: false,
        type: "null",
        keyName: "_id",
        editable: false,
        },
        nombreInvestigacion: {
        name: "Nombre de la Investigación",
        show: true,
        type: "text",
        keyName: "nombreInvestigacion",
        editable: true,
        },
        encargados: {
        name: "Encargados",
        show: true,
        type: "selectable-fetched-list-text",
        keyName: "encargados",
        editable: true,
        choices: miembrosNames.map((miembro) => miembro.nombre),
        choices_id: miembrosNames.map((miembro) => miembro.id),
        },
        fechaPublicacion: {
        name: "Fecha de Publicación",
        show: true,
        type: "date",
        keyName: "fechaPublicacion",
        editable: true,
        },
        textoExplicativo: {
        name: "Texto Explicativo",
        show: false,
        type: "large-text",
        keyName: "textoExplicativo",
        editable: true,
        },
        imagenes: {
        name: "Imágenes",
        show: false,
        type: "multiple-images",
        keyName: "imagenes",
        editable: true,
        },
        documentoDetallado: {
        name: "Documento Detallado",
        show: false,
        type: "document",
        keyName: "documentoDetallado",
        editable: true,
        },
    };
};