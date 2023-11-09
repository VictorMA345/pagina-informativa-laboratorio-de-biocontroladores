const mongoose = require('mongoose');

const Schema = mongoose.Schema ;

const proyectoSchema = new Schema({
    investigadores : {  
        type: [String],
        required: true
    },
    tituloProyecto : {
        type : String,
        required: true
    },
    fechaInicio : {
        type: Date,
        required: true,
    },
    fechaFinalizacion : {
        type : Date,
    },
    referencias : {
        type: [String],
        required: true
    },
    imagenes : {
        type : [String],
        default : []
    },
    documentos : {
        type : String,
        default : ""   
    },
    financiamiento : {
        type : String,
        required: true,
    },
    resumenProyecto : {
        type : String,
        required: true,
        default: "No hay resumen del proyecto"
    },
    anioProyecto : {
        type: String,
        required: true
    },
    areasInvestigacion : {
        type : [String],
        required: true,
        default: []
    },
    palabrasClave : {
        type: [String],
        required: true,
        default : []
    }
},{ timestamps : true ,versionKey: '__v' });

module.exports = mongoose.model('proyectos',proyectoSchema,'proyectos')