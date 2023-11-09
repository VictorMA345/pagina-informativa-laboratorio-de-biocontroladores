const mongoose = require('mongoose');

const Schema = mongoose.Schema

    const EstudiantesSchema = new Schema({
        carneEstudiante : {
            required: true,
            type : String
        },
        cedula :{
            required: true,
            type : String
        },
        nombreCompleto : {
            required: true,
            type : String
        },
        fotoPerfil : {
            type: String
        },
        carrera : {
            type: String,
            required : true
        },
        investigacion: {
            type: String,
            required : true
        },
        genero : {
            type: String,
            required: true
        },
        correoElectronico : {
            type: String,
            required: true
        },
        anioIngreso : {
            type: String
        },
        curriculum : {
            type: String
        }
    },{ timestamps : true })

module.exports = mongoose.model('estudiantes',EstudiantesSchema,'estudiantes')