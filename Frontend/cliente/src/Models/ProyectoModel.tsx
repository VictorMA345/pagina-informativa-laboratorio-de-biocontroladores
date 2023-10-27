
export interface Proyecto {
  _id: string;
  investigadores: string[];
  tituloProyecto: string;
  fechaInicio: string;
  fechaFinalizacion: string;
  referencias: string[];
  imagenes: string[];
  documentos: string[];
  financiamiento: string;
  resumenProyecto: string;
  anioProyecto: number;
  areasInvestigacion: string[];
  palabrasClave: string[];
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

export interface ProyectoStructure {
  _id?: FieldProperties;
  investigadores: FieldProperties;
  tituloProyecto: FieldProperties;
  fechaInicio: FieldProperties;
  fechaFinalizacion: FieldProperties;
  referencias: FieldProperties;
  imagenes: FieldProperties;
  documentos: FieldProperties;
  financiamiento: FieldProperties;
  resumenProyecto: FieldProperties;
  anioProyecto: FieldProperties;
  areasInvestigacion: FieldProperties;
  palabrasClave: FieldProperties;
}

export const getProyectoStructure = async (): Promise<ProyectoStructure> => {
  return {
    _id: {
      name: "ID",
      show: false,
      type: "null",
      keyName: "_id",
    },
    investigadores: {
      name: "Investigadores",
      show: true,
      type: "selectable-fetched-list-text",
      keyName: "investigadores"
    },
    tituloProyecto: {
      name: "Título del Proyecto",
      show: true,
      type: "text",
      keyName: "tituloProyecto"
    },
    fechaInicio: {
      name: "Fecha de Inicio",
      show: true,
      type: "date",
      keyName: "fechaInicio"
    },
    fechaFinalizacion: {
      name: "Fecha de Finalización",
      show: true,
      type: "date",
      keyName: "fechaFinalizacion"
    },
    referencias: {
      name: "Referencias",
      show: false,
      type: "list",
      keyName: "referencias"
    },
    imagenes: {
      name: "Imágenes",
      show: false,
      type: "multiple-images",
      keyName: "imagenes"
    },
    documentos: {
      name: "Documento",
      show: false,
      type: "document",
      keyName: "documentos"
    },
    financiamiento: {
      name: "Financiamiento",
      show: true,
      type: "text",
      keyName: "financiamiento"
    },
    resumenProyecto: {
      name: "Resumen del Proyecto",
      show: false,
      type: "large-text",
      keyName: "resumenProyecto"
    },
    anioProyecto: {
      name: "Año del Proyecto",
      show: true,
      type: "text",
      keyName: "anioProyecto"
    },
    areasInvestigacion: {
      name: "Áreas de Investigación",
      show: false,
      type: "list",
      keyName: "areasInvestigacion"
    },
    palabrasClave: {
      name: "Palabras Clave",
      show: false,
      type: "list",
      keyName: "palabrasClave"
    }
  };
};
