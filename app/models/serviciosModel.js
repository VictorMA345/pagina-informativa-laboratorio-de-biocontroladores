const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const serviciosSchema = new Schema({
    nombreServicio : {
        type : String,
        required : true
    },
    descripcion : {
        type : String,
        default : "No hay Descripción."
    },
    tipoServicio : {
        type : String,
        required : true,
    },  
    telefono : {
        type: String,
        required : true
    },
    correoElectronico : {
        type: String,
        required : true
    },
    fotosServicio : {
        type: [String],
        default: []
    },
    fechaPublicacion : {
        type: Date,
        default: Date.now   
    }

},{ timestamps : true })

module.exports = mongoose.model('servicios',serviciosSchema,'servicios')