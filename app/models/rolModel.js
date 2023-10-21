const mongoose = require('mongoose');

const Schema = mongoose.Schema ;

const RolSchema = new Schema({
    role_name : {
        type : String,
        required: true
    },
    descripcion : {
        type : String,
        default: "No hay descripción"
    },
    general_permissions : {
        create : {
            type: Boolean,
            required: true,
            default: false
        },
        delete :{
            type: Boolean,
            required: true,
            default: false
        },
        update : {
            type: Boolean,
            required: true,
            default: false
        }
    },
    permissions : {
        colaboradores: {
            type: Boolean,
            required: true,
            default: false
        },
        control_biologico: {
            type: Boolean,
            required: true,
            default: false
        },
        enfermedades : {
            type: Boolean,
            required: true,
            default: false
        },
        estudiantes : {
            type: Boolean,
            required: true,
            default: false
        },
        miembros : {
            type: Boolean,
            required: true,
            default: false
        },
        noticias : {
            type: Boolean,
            required: true,
            default: false
        },
        proyectos : {
            type: Boolean,
            required: true,
            default: false     
        },
        servicios:  {
            type: Boolean,
            required: true,
            default: false
        },
        tesis : {
            type: Boolean,
            required: true,
            default: false
        },
        rol : {
            type: Boolean,
            required: true,
            default: false
        }
    }
}) 

module.exports = mongoose.model('rol',RolSchema,'rol')