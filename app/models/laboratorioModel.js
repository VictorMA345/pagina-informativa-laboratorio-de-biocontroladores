const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const LaboratorioSchema = new Schema({
    direccion: {
      type: String,
      required: true
    },
    correo: {
      type: String,
      required: true
    },
    mision: {
      type: String,
      required: true
    },
    vision: {
      type: String,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    descripcion: {
      type: String,
      required: true
    },
    visitas: {
      type: Number,
      required : true
    },
    imagenPrincipal: {
      type: String,
      required:true
    }
  },{ timestamps : true });

  module.exports = mongoose.model('laboratorio',LaboratorioSchema,'laboratorio');