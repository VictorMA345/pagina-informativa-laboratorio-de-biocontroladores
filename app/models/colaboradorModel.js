const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const colaboradoresSchema = new Schema({
    nombreCompleto : {
        type: String,
        required: true,
    },
    listaEstudios : {
        type: [String],
        default : []
    },
    proyectosColaborados : {
        type: [String],
        default : []  
    },
    fotoPerfil : {
        type: String,
        default: ""
    },
    descripcion :{
        type: String,
        default: "No hay descripción"
    }
},{ timestamps : true }) 


module.exports = mongoose.model('colaboradores',colaboradoresSchema,'colaboradores');