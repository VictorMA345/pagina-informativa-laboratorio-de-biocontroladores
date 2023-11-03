
const Colaborador = require("../models/colaboradorModel.js")
const { authorize, uploadFile,deleteFileFromDrive,replaceFileInDrive,esURLGoogleDriveValida } = require('../storageMethods');
const mongoose = require('mongoose')

// Get Methods
const getColaborador = async(req,res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No existe ese colaborador'})
    }
    const colaborador = await Colaborador.findById(id)
    if (!colaborador) {
      return res.status(404).json({error: 'No existe ese colaborador'})
    }
    res.status(200).json(colaborador)
}
const getAllColaboradores = async (req, res) => {
    const orden = req.query.orden || 'desc';
    const resultadoBusqueda = req.query.busqueda || '';
    const clavePorBuscar = req.query.clave || '';
    const ordenacion = {};
    const busqueda = {};
    if (clavePorBuscar !== '') {
      if (orden === 'asc') {
        ordenacion[clavePorBuscar] = 1;
      } else {
        ordenacion[clavePorBuscar] = -1;
      }
    }
    if (resultadoBusqueda !== '' && clavePorBuscar !== '') {
      busqueda[clavePorBuscar] = { $regex: new RegExp(resultadoBusqueda, 'i') };
    }
    let pagina = parseInt(req.query.pagina) || 1;
    let cantidad = parseInt(req.query.cantidad) || 10;
    const skipAmount = (pagina - 1) * cantidad;
    try {
      const colaboradores = await Colaborador.find(busqueda)
        .sort(ordenacion)
        .limit(cantidad)
        .skip(skipAmount);
      const colaboradoresCount = await Colaborador.count();
      const data = {
        data: colaboradores,
        itemCounts: colaboradoresCount,
      };
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
// Post Methods
const postColaborador = async(req,res) => {
    const {
        nombreCompleto,
        listaEstudios,
        proyectosColaborados,
        descripcion
    } = req.body
    try{

      if (nombreCompleto === ""){
        return res.status(400).json({error: "No se puede crear un colaborador sin un nombre"})
      }
      if (nombreCompleto.length >= 150){
        return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
      }
      if (nombreCompleto.length < 10){
        return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
      }
      const contieneNumeros = /\d/.test(nombreCompleto);
      const contieneSimbolos = /[^A-Za-z0-9\s]/.test(nombreCompleto);
      if (contieneNumeros || contieneSimbolos){
        return res.status(400).json({error: "El nombre no puede contener símbolos o número."})
      }

      const authClient = await authorize();
      fotoPerfilUrl = ""
      if ( req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0]){
          const uploadedFile = req.files['fotoPerfil'][0];
          if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
            return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
        }
          const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
          const childFolder = "fotos-de-colaboradores"
          const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
          fotoPerfilUrl = `https://drive.google.com/uc?id=${file['data'].id}`
      }
      const ColaboradorNuevo = 
      await Colaborador.create({
          nombreCompleto,
          listaEstudios,
          proyectosColaborados,
          fotoPerfil : fotoPerfilUrl,
          descripcion
          })
        res.status(200).json(ColaboradorNuevo);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Delete Methods
const deleteColaborador = async(req,res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No existe esa enfermedad'})
    }
    const colaborador = await Colaborador.findById(id)
    const authClient = await authorize();
    if (!colaborador) {
        return res.status(400).json({ error: 'No existe ese colaborador' });
    }
    if(colaborador.fotoPerfil !== ""){
        const fotoPerfilUrl = colaborador.fotoPerfil;
        await deleteFileFromDrive(authClient,fotoPerfilUrl);
    }
    const colaboradorEliminado = await Colaborador.findOneAndDelete({_id: id})
    if(!colaboradorEliminado) {
      return res.status(400).json({error: 'No existe esa enfermedad'})
    }
    res.status(200).json(colaboradorEliminado)
} 

// Patch Methods
const patchColaborador = async(req,res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No existe ese colaborador.'})
    }
    if (req.body.nombreCompleto === ""){
      return res.status(400).json({error: "No puede haber un colaborador sin un nombre"})
    }
    if (req.body.nombreCompleto.length >= 150){
      return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    const contieneNumeros = /\d/.test(req.body.nombreCompleto);
    const contieneSimbolos = /[^A-Za-z0-9\s]/.test(req.body.nombreCompleto);
    if (contieneNumeros || contieneSimbolos){
      return res.status(400).json({error: "El nombre no puede contener símbolos o número."})
    }
    const colaboradorAntiguo = await Colaborador.findById(id);
    const authClient = await authorize();
    let newFotoDePerfilURL = ""
    if (req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0]) {
        const newFotoPerfil = req.files['fotoPerfil'][0];
        if (!['image/jpeg','image/png','image/jpg'].includes(newFotoPerfil.mimetype)){
          return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
      }
        if (colaboradorAntiguo.fotoPerfil && esURLGoogleDriveValida(colaboradorAntiguo.fotoPerfil)) {
            newFotoDePerfilURL = await replaceFileInDrive(authClient, newFotoPerfil ,colaboradorAntiguo.fotoPerfil,"fotos-de-colaboradores");
            newFotoDePerfilURL = `https://drive.google.com/uc?id=${newFotoDePerfilURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "fotos-de-colaboradores";
            const file = await uploadFile(authClient, newFotoPerfil, folderName, childFolder);
            newFotoDePerfilURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    } else {
      if (colaboradorAntiguo.fotoPerfil && colaboradorAntiguo.fotoPerfil !== req.body.fotoPerfil  && esURLGoogleDriveValida(colaboradorAntiguo.fotoPerfil) ) 
      {
          await deleteFileFromDrive(authClient,colaboradorAntiguo.fotoPerfil);
      }
  }
    const colaborador = await Colaborador.findOneAndUpdate({_id: id}, {
        ...req.body,
        fotoPerfil: req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0] ?  newFotoDePerfilURL : req.body.fotoPerfil
    })
    if (!colaborador) {
        return res.status(400).json({error: 'No existe ese colaborador'})
    }
    res.status(200).json(colaborador)      
}

const patchAllColaboradores = async(req,res) => {
    const updateResult = await Colaborador.updateMany(
        {}, 
        { $set: req.body } 
    );
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
    }
    res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
}

module.exports = {
    getColaborador,
    getAllColaboradores,
    postColaborador,
    deleteColaborador,
    patchColaborador,
    patchAllColaboradores
}; 