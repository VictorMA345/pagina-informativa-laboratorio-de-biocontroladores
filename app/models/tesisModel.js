const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tesisSchema = new Schema({
    tituloTesis : {
        type: String,
        required: true
    },
    resumenTesis : {
        type: String,
        required: true
    },
    abstract : {
        type: String,
        required: true
    },
    pathFotoTitulo : {
        type: String,
    },
    imagenesExtras : {
        type: [String],
        default : []
    },
    pathArchivo : {
        type: String,
        required: true
    },
    citasReferencias : {
        type: [String],
        required: true
    },
    estadoTesis : {
        type: String,
        required: true 
    },
    fechaInicio : {
        type: Date,
        required: true 
    },
    fechaFinalizacion : {
        type: Date
    },
    palabrasClave : {
        type: [String],
        default : []
    },
    gradoObtenido : {
        type: String
    },
    estudiantesParticipantes : {
        type: [String],
        required: true
    },
    anioTesis : {
        type: String,
        required: true
    },
    empresasParticipantes :{
        type: [String],
        default: []
    },
    financiamiento : {
        type: String,
        required: true
    },
    miembrosComite: {
        type: [String],
        required: true,
        default: []
    },
    nombreComite: {
        type: String,
        required: true,
        default: ""
    },
},{ timestamps : true })


module.exports = mongoose.model('tesis',tesisSchema,'tesis')