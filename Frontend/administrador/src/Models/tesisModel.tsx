import { getAllEstudiantesNames } from "../services";
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
    editable?: boolean;
    defaultValue?: string;
    choices?: string[];
    choices_id?: string[];
  }
  
  export interface TesisStructure {
    _id?: FieldProperties;
    tituloTesis: FieldProperties;
    resumenTesis: FieldProperties;
    abstract: FieldProperties
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
    const estudiantesNombres = await getAllEstudiantesNames();
    return {
      _id: {
        name: "ID",
        show: false,
        type: "null",
        keyName: "_id",
        editable: false,
      },
      tituloTesis: {
        name: "Título de Tesis",
        show: true,
        type: "text",
        keyName: "tituloTesis",
        editable: true,
      },
      resumenTesis: {
        name: "Resumen de Tesis",
        show: false,
        type: "large-text",
        keyName: "resumenTesis",
        editable: true,
      },
      abstract: {
        name: "Abstract",
        show: false,
        type: "large-text",
        keyName: "abstract",
        editable: true,
      },
      pathFotoTitulo: {
        name: "Foto de Título",
        show: false,
        type: "single-image",
        keyName: "pathFotoTitulo",
        editable: true,
      },
      imagenesExtras: {
        name: "Imágenes Extras",
        show: false,
        type: "multiple-images",
        keyName: "imagenesExtras",
        editable: true,
      },
      pathArchivo: {
        name: "Archivo de Tesis",
        show: false,
        type: "document",
        keyName: "pathArchivo",
        editable: true,
      },
      citasReferencias: {
        name: "Citas y Referencias",
        show: false,
        type: "list",
        keyName: "citasReferencias",
        editable: true,
      },
      estadoTesis: {
        name: "Estado de Tesis",
        show: true,
        type: "selectable-text",
        keyName: "estadoTesis",
        editable: true,
        choices: ['Finalizada','En ejecución','Suspendida']
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
      palabrasClave: {
        name: "Palabras Clave",
        show: false,
        type: "list",
        keyName: "palabrasClave",
        editable: true,
      },
      gradoObtenido: {
        name: "Grado Obtenido",
        show: true,
        type: "text",
        keyName: "gradoObtenido",
        editable: true,
      },
      estudiantesParticipantes: {
        name: "Estudiantes Participantes",
        show: false,
        type: "selectable-fetched-list-text",
        keyName: "estudiantesParticipantes",
        editable: true,
        choices: await estudiantesNombres.map((estudiante) => estudiante.nombre),
        choices_id: await estudiantesNombres.map((estudiante) => estudiante.id) 
      },
      anioTesis: {
        name: "Año de Tesis",
        show: true,
        type: "text",
        keyName: "anioTesis",
        editable: true,
      },
      empresasParticipantes: {
        name: "Empresas Participantes",
        show: false,
        type: "list",
        keyName: "empresasParticipantes",
        editable: true,
      },
      financiamiento: {
        name: "Financiamiento",
        show: true,
        type: "text",
        keyName: "financiamiento",
        editable: true,
      },
      miembrosComite: {
        name: "Miembros del Comité",
        show: false,
        type: "list",
        keyName: "miembrosComite",
        editable: true,
      },
      nombreComite: {
        name: "Nombre del Comité",
        show: true,
        type: "text",
        keyName: "nombreComite",
        editable: true,
      },
    };
  };