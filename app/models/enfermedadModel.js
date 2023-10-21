const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const enfermedadesSchema = new Schema({
    enfermedad : {
        type: String,
        required: true,
        default: "Nombre no especificado"
    },
    cultivo :{
        type: [String],
        required: true
    },
    descripcion: {
        type: String,
        required: true,
        default: "No hay descripción"
    },
    fitopatogeno :{
        type: String,
        required: true,
        default: "Nombre de fitopatogeno no especificado"
    },
    autor :{
        type: [String],
        required: true,
    },
    imagenes:{
        type: [String],
        default: []
    },
    documento:{
        type: String,
        default: ""
    }
},{ timestamps : true }) 


module.exports = mongoose.model('enfermedades',enfermedadesSchema,'enfermedades');