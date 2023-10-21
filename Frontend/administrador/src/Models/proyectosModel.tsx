import { getAllMiembrosNames } from "../services"; // Asegúrate de tener un servicio similar para obtener nombres de investigadores.

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
  const investigadoresNombres = await getAllMiembrosNames(); // Asegúrate de tener una función similar para obtener los nombres de los investigadores.
  return {
    _id: {
      name: "ID",
      show: false,
      type: "null",
      keyName: "_id",
      editable: false,
    },
    investigadores: {
      name: "Investigadores",
      show: true,
      type: "selectable-fetched-list-text",
      keyName: "investigadores",
      editable: true,
      choices: investigadoresNombres.map((investigador) => investigador.nombre),
      choices_id: investigadoresNombres.map((investigador) => investigador.id),
    },
    tituloProyecto: {
      name: "Título del Proyecto",
      show: true,
      type: "text",
      keyName: "tituloProyecto",
      editable: true,
    },
    fechaInicio: {
      name: "Fecha de Inicio",
      show: true,
      type: "date",
      keyName: "fechaInicio",
      editable: true,
    },
    fechaFinalizacion: {
      name: "Fecha de Finalización",
      show: true,
      type: "date",
      keyName: "fechaFinalizacion",
      editable: true,
    },
    referencias: {
      name: "Referencias",
      show: false,
      type: "list",
      keyName: "referencias",
      editable: true,
    },
    imagenes: {
      name: "Imágenes",
      show: false,
      type: "multiple-images",
      keyName: "imagenes",
      editable: true,
    },
    documentos: {
      name: "Documento",
      show: false,
      type: "document",
      keyName: "documentos",
      editable: true,
    },
    financiamiento: {
      name: "Financiamiento",
      show: true,
      type: "text",
      keyName: "financiamiento",
      editable: true,
    },
    resumenProyecto: {
      name: "Resumen del Proyecto",
      show: false,
      type: "large-text",
      keyName: "resumenProyecto",
      editable: true,
    },
    anioProyecto: {
      name: "Año del Proyecto",
      show: true,
      type: "text",
      keyName: "anioProyecto",
      editable: true,
    },
    areasInvestigacion: {
      name: "Áreas de Investigación",
      show: false,
      type: "list",
      keyName: "areasInvestigacion",
      editable: true,
    },
    palabrasClave: {
      name: "Palabras Clave",
      show: false,
      type: "list",
      keyName: "palabrasClave",
      editable: true,
    }
  };
};
