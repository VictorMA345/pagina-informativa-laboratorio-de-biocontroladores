import { getAllMiembrosNames } from "../services";

// Definición del modelo de Noticias
export interface Noticia {
  _id: string;
  titulo: string;
  publicador: string;
  imagenes: string[];
  categoria: string;
  citasBibliograficas: string[];
  textoCompleto: string;
  documentoComplementario: string;
  fechaPublicacion: string;
}

// Definición de las propiedades de campo (FieldProperties)
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

// Estructura del modelo de Noticias
export interface NoticiaStructure {
  _id?: FieldProperties;
  titulo: FieldProperties;
  publicador: FieldProperties;
  imagenes: FieldProperties;
  categoria: FieldProperties;
  citasBibliograficas: FieldProperties;
  textoCompleto: FieldProperties;
  documentoComplementario: FieldProperties;
  fechaPublicacion: FieldProperties;
}

// Función para obtener la estructura del modelo de Noticias
export const getNoticiaStructure = async (): Promise<NoticiaStructure> => {
  const miembrosNombres = await getAllMiembrosNames();
  return {
    _id: {
      name: "ID",
      show: false,
      type: "null",
      keyName: "_id",
      editable: false,
    },
    titulo: {
      name: "Título",
      show: true,
      type: "text",
      keyName: "titulo",
      editable: true,
    },
    publicador: {
      name: "Publicador",
      show: true,
      type: "text",
      keyName: "publicador",
      editable: true,
      choices: await miembrosNombres.map((miembro) => miembro.nombre),
      choices_id: await miembrosNombres.map((miembro) => miembro.id) 
    },
    imagenes: {
      name: "Imágenes",
      show: false,
      type: "multiple-images",
      keyName: "imagenes",
      editable: true,
    },
    categoria: {
      name: "Categoría",
      show: true,
      type: "text",
      keyName: "categoria",
      editable: true,
    },
    citasBibliograficas: {
      name: "Citas Bibliográficas",
      show: false,
      type: "list",
      keyName: "citasBibliograficas",
      editable: true,
    },
    textoCompleto: {
      name: "Resumen de Noticia",
      show: false,
      type: "large-text",
      keyName: "textoCompleto",
      editable: true,
    },
    documentoComplementario: {
      name: "Documento Complementario",
      show: false,
      type: "document",
      keyName: "documentoComplementario",
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
