const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoticiaSchema = new Schema({
    titulo : {
        type : String,
        required: true,
    },
    publicador : {
        type: String,
        required: true
    },
    imagenes : {
        type: [String],
        default: []
    },
    categoria : {
        type: String,
        default: ""
    },
    citasBibliograficas : {
        type: [String],
    },
    textoCompleto : {
        type: String,
        required: true,
        default: "No hay Descripción"
    },
    documentoComplementario : {
        type: String,
        default: ""
    },
    fechaPublicacion : {
        type: Date,
    }
},{ timestamps : true });

module.exports = mongoose.model('noticias',NoticiaSchema,'noticias')