const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')
const Schema = mongoose.Schema;

const MiembroSchema = new Schema({
    nombreCompleto :{
        type: String,
        required : true,
    },
    rolLaboratorio :{
        type: String,
        required : true
    },
    correo :{
        type: String,
        unique: true,
        required: true
    },
    contrasena: {   
        type: String,
        required: true
    },
    telefono :{
        type: String
    },
    genero : {
        type: String,
        required : true
    },
    fotoPerfil : {
        type : String
    },
    areaEspecializacion : {
        type: [String],
        default: []
    },
    proyectosParticipacion : {
        type: [String],
        default: []
    },
    curriculumDocumento : {
        type: String,
    },
    resumen : {
        type: String,
        default: "No hay descripción del miembro"
    },
    fechaNacimiento : {
        type: Date,
    }
},{ timestamps : true })


//Sign Up
MiembroSchema.statics.signup = async function(
    nombreCompleto,
    rolLaboratorio,
    correo,
    telefono,
    genero,
    fotoPerfil,
    areaEspecializacion,
    proyectosParticipacion,
    curriculumDocumento,
    resumen,
    fechaNacimiento,
    contrasena
    ) {
    // Validaciones
    if (!correo || !contrasena){
        throw Error('Todos los campos deben ser llenados.');
    }
    if(!validator.isEmail(correo)){
        throw Error('El correo no es válido.');
    }
    if(!validator.isStrongPassword(contrasena)){
        throw Error('La contraseña no es lo suficientemente fuerte.')
    }
    const exists = await this.findOne({ correo })
    if (exists){
        throw Error('El correo Ya existe');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contrasena, salt);

    const user = await this.create({ 
        correo, 
        nombreCompleto: nombreCompleto,
        rolLaboratorio : rolLaboratorio,
        correo: correo,
        telefono: telefono,
        genero: genero,
        fotoPerfil: fotoPerfil,
        areaEspecializacion: areaEspecializacion,
        proyectosParticipacion: proyectosParticipacion,
        curriculumDocumento : curriculumDocumento,
        resumen: resumen,
        fechaNacimiento: fechaNacimiento,
        contrasena : hash
     })
    return user
}
// Login
MiembroSchema.statics.login = async function(
    correo,
    contrasena
    )
{
    // Validaciones
    if (!correo || !contrasena){
        throw Error('Todos los campos deben ser llenados.');
    };

    const usuario = await this.findOne({ correo });
    if(!validator.isEmail(correo)){
        throw Error('No hay usuario registrado con ese correo.');
    };

    const match = await bcrypt.compare(contrasena,usuario.contrasena);
    if (!match) {
        throw Error("La contraseña es incorrecta.");
    }   
    return usuario
}

module.exports = mongoose.model('miembros',MiembroSchema,'miembros');