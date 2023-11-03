
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
  return {
    imagenes: {
        name: "Imágenes",
        show: true,
        type: "multiple-images",
        keyName: "imagenes"
      },
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
      keyName: "titulo"
    },
    publicador: {
      name: "Publicador",
      show: true,
      type: "text",
      keyName: "publicador"
    },
    categoria: {
      name: "Categoría",
      show: true,
      type: "text",
      keyName: "categoria"
    },
    citasBibliograficas: {
      name: "Citas Bibliográficas",
      show: false,
      type: "list",
      keyName: "citasBibliograficas"
    },
    textoCompleto: {
      name: "Resumen de Noticia",
      show: false,
      type: "large-text",
      keyName: "textoCompleto"
    },
    documentoComplementario: {
      name: "Documento Complementario",
      show: false,
      type: "document",
      keyName: "documentoComplementario"
    },
    fechaPublicacion: {
      name: "Fecha de Publicación",
      show: true,
      type: "date",
      keyName: "fechaPublicacion"
    },
  };
};
