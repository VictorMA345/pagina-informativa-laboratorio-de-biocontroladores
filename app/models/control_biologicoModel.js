const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const control_biologicoSchema = new Schema({
    nombreInvestigacion: {
        type: String,
        required: true,
    },
    encargados : {
        type : [String],
        required : true
    },
    fechaPublicacion : {
        type: Date,
        required: true
    },
    textoExplicativo : {
        type: String,
        required: true,
        default : "No hay Descripción"
    },
    abstract : {
        type: String,
        required: true,
        default : "No hay Descripción"
    },
    imagenes : {
        type : [String],
        default: []
    },
    documentoDetallado : {
        type : String,
        default: ""
    }
},{ timestamps : true });

module.exports = mongoose.model('control_biologico',control_biologicoSchema,'control_biologico')