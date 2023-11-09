export interface Tesis {
    _id: string;
    tituloTesis: string;
    resumenTesis: string;
    abstract: string;
    pathFotoTitulo: string;
    imagenesExtras: string[];
    pathArchivo: string;
    citasReferencias: string[];
    estadoTesis: string;
    fechaInicio: string;
    fechaFinalizacion: string;
    palabrasClave: string[];
    gradoObtenido: string;
    estudiantesParticipantes: string[];
    anioTesis: number;
    empresasParticipantes: string[];
    financiamiento: string;
    miembrosComite: string[];
    nombreComite: string;
  }
  
  interface FieldProperties {
    name?: string;
    show?: boolean;
    type?: string;
    keyName?: string;
    edite?: boolean;
    defaultValue?: string;
    choices?: string[];
    choices_id?: string[];
  }
  
  export interface TesisStructure {
    _id?: FieldProperties;
    tituloTesis: FieldProperties;
    resumenTesis: FieldProperties;
    abstract: FieldProperties;
    pathFotoTitulo: FieldProperties;
    imagenesExtras: FieldProperties;
    pathArchivo: FieldProperties;
    citasReferencias: FieldProperties;
    estadoTesis: FieldProperties;
    fechaInicio: FieldProperties;
    fechaFinalizacion: FieldProperties;
    palabrasClave: FieldProperties;
    gradoObtenido: FieldProperties;
    estudiantesParticipantes: FieldProperties;
    anioTesis: FieldProperties;
    empresasParticipantes: FieldProperties;
    financiamiento: FieldProperties;
    miembrosComite: FieldProperties;
    nombreComite: FieldProperties;
  }
  
  export const getTesisStructure = async (): Promise<TesisStructure> => {
    return {
        pathFotoTitulo: {
            name: "Foto de Título",
            show: true,
            type: "single-image",
            keyName: "pathFotoTitulo",
        },
      _id: {
        name: "ID",
        show: false,
        type: "null",
        keyName: "_id",
        edite: false,
      },
      tituloTesis: {
        name: "Título de Tesis",
        show: true,
        type: "text",
        keyName: "tituloTesis",
      },
      resumenTesis: {
        name: "Resumen de Tesis",
        show: false,
        type: "large-text",
        keyName: "resumenTesis",
      },
      abstract: {
        name: "Abstract",
        show: false,
        type: "large-text",
        keyName: "tituloTesis",
      },
      imagenesExtras: {
        name: "Imágenes Extras",
        show: false,
        type: "multiple-images",
        keyName: "imagenesExtras",
      },
      pathArchivo: {
        name: "Archivo de Tesis",
        show: false,
        type: "document",
        keyName: "pathArchivo",
      },
      citasReferencias: {
        name: "Citas y Referencias",
        show: false,
        type: "list",
        keyName: "citasReferencias",
      },
      estadoTesis: {
        name: "Estado de Tesis",
        show: true,
        type: "selectable-text",
        keyName: "estadoTesis",
      },
      fechaInicio: {
        name: "Fecha de Inicio",
        show: true,
        type: "date",
        keyName: "fechaInicio",
      },
      fechaFinalizacion: {
        name: "Fecha de Finalización",
        show: true,
        type: "date",
        keyName: "fechaFinalizacion",
      },
      palabrasClave: {
        name: "Palabras Clave",
        show: false,
        type: "list",
        keyName: "palabrasClave",
      },
      gradoObtenido: {
        name: "Grado Obtenido",
        show: true,
        type: "text",
        keyName: "gradoObtenido",
      },
      estudiantesParticipantes: {
        name: "Estudiantes Participantes",
        show: false,
        type: "selectable-fetched-list-text",
        keyName: "estudiantesParticipantes",
      },
      anioTesis: {
        name: "Año de Tesis",
        show: true,
        type: "text",
        keyName: "anioTesis",
      },
      empresasParticipantes: {
        name: "Empresas Participantes",
        show: false,
        type: "list",
        keyName: "empresasParticipantes",
      },
      financiamiento: {
        name: "Financiamiento",
        show: true,
        type: "text",
        keyName: "financiamiento",
      },
      miembrosComite: {
        name: "Miembros del Comité",
        show: false,
        type: "list",
        keyName: "miembrosComite",
      },
      nombreComite: {
        name: "Nombre del Comité",
        show: true,
        type: "text",
        keyName: "nombreComite",
      },
    };
  };