const Servicio = require('../models/serviciosModel');
const mongoose = require('mongoose');
const { authorize, uploadFile, deleteFileFromDrive, contieneSoloNumerosOSimbolos,esEmailValido ,addWatermarkToImage } = require('../storageMethods');

// Get Methods
const getServicio = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No existe ese servicio.' });
  }
  const servicio = await Servicio.findById(id);
  if (!servicio) {
    return res.status(404).json({ error: 'No existe ese servicio.' });
  }
  res.status(200).json(servicio);
};

const getAllServicio = async (req, res) => {
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
    let pagina = parseInt(req.query.pagina) || 1
    let cantidad =  parseInt(req.query.cantidad) || 10
    const skipAmount = (pagina - 1) * cantidad; 
    const servicios = await Servicio.find(busqueda)
    .sort(ordenacion)
    .limit(cantidad)
    .skip(skipAmount);
    const serviciosCount = await Servicio.count()
    const data = {
        data: servicios,
        itemCounts: serviciosCount
    }
    res.status(200).json(data);
};

// Post Methods
const postServicio = async (req, res) => {
  const {
    nombreServicio,
    descripcion,
    tipoServicio,
    correoElectronico,
    telefono,
    fechaPublicacion,
  } = req.body;
  try {

    if (nombreServicio === ""){
      return res.status(400).json({error: "No se puede crear un servicio sin un nombre"})
    }
    if (nombreServicio.length >= 150){
      return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    if (tipoServicio === ""){
      return res.status(400).json({error: "No se puede crear un servicio sin un nombre"})
    }
    if (tipoServicio.length >= 150){
      return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }

    if (correoElectronico === ""){
      return res.status(400).json({error: "No se puede crear un servicio sin un correo electrónico válido."})
    }
    if (correoElectronico.length >= 40){
      return res.status(400).json({error: "El correo electrónico es muy largo. por favor usar un  correo electrónico más corto"})
    }
    if(!esEmailValido(correoElectronico)){
      return res.status(400).json({error: "El correo electrónico no tiene el formato correcto"})
    }

    if (telefono === ""){
      return res.status(400).json({error: "No se puede crear un servicio sin un número de teléfono válido."})
    }
    if (telefono.length >= 20){
      return res.status(400).json({error: "El número de teléfono es muy largo. por favor usar un número de teléfono más corto"})
    }
    if(!contieneSoloNumerosOSimbolos(telefono)){
      return res.status(400).json({error: "Los números de teléfono no pueden contener letras."})
    }

    const authClient = await authorize();
    let fotosServicioUrls = [];
    if (req.files && req.files['fotosServicio'] && req.files['fotosServicio'].length > 0) {
      const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
      const childFolder = 'fotos-servicios';
      for (const uploadedFile of req.files['fotosServicio']) {
        const watermarkedImageBuffer = await addWatermarkToImage(uploadedFile.buffer);
        if (watermarkedImageBuffer) {
          const file = await uploadFile(authClient,  {
            fieldname: 'fotosServicio',
            originalname: uploadedFile.originalname,
            encoding: uploadedFile.encoding,
            mymetype: uploadedFile.mimetype, 
            buffer: watermarkedImageBuffer,
          }, folderName, childFolder);
          const fotoServicioUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
          fotosServicioUrls.push(fotoServicioUrl);
        }

      }
    }
    const servicioNuevo = await Servicio.create({
      nombreServicio,
      descripcion,
      tipoServicio,
      correoElectronico,
      telefono,
      fotosServicio: fotosServicioUrls,
      fechaPublicacion
    });
    res.status(200).json(servicioNuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Methods
const deleteServicio = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No existe ese servicio.' });
  }
  const servicioAntiguo = await Servicio.findById(id);
  if (!servicioAntiguo) {
    return res.status(400).json({ error: 'No existe ese servicio.' });
  }
  const authClient = await authorize();
  if (servicioAntiguo.fotosServicio && servicioAntiguo.fotosServicio.length > 0) {
    for (const fotoServicioUrl of servicioAntiguo.fotosServicio) {
      await deleteFileFromDrive(authClient, fotoServicioUrl);
    }
  }
  const servicio = await Servicio.findOneAndDelete({ _id: id });
  if (!servicio) {
    return res.status(400).json({ error: 'No existe ese servicio.' });
  }
  res.status(200).json(servicio);
};

// Patch Methods
const patchServicio = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No existe ese servicio.' });
  }

  if (req.body.nombreServicio === ""){
    return res.status(400).json({error: "No se puede editar un servicio sin un nombre"})
  }
  if (req.body.nombreServicio.length >= 150){
    return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
  }
  if (req.body.tipoServicio === ""){
    return res.status(400).json({error: "No se puede editar un servicio sin un nombre"})
  }
  if (req.body.tipoServicio.length >= 150){
    return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
  }

  if (req.body.correoElectronico === ""){
    return res.status(400).json({error: "No se puede editar un servicio sin un correo electrónico válido."})
  }
  if (req.body.correoElectronico.length >= 40){
    return res.status(400).json({error: "El correo electrónico es muy largo. por favor usar un  correo electrónico más corto"})
  }
  if(!esEmailValido(req.body.correoElectronico)){
    return res.status(400).json({error: "El correo electrónico no tiene el formato correcto"})
  }

  if (req.body.telefono === ""){
    return res.status(400).json({error: "No se puede editar un servicio sin un número de teléfono válido."})
  }
  if (req.body.telefono.length >= 20){
    return res.status(400).json({error: "El número de teléfono es muy largo. por favor usar un número de teléfono más corto"})
  }
  if(!contieneSoloNumerosOSimbolos(req.body.telefono)){
    return res.status(400).json({error: "Los números de teléfono no pueden contener letras."})
  }

  const authClient = await authorize();
  const servicioAntiguo = await Servicio.findById(id);
  if (!servicioAntiguo) {
    return res.status(400).json({ error: 'No existe ese servicio.' });
  }

  let newImages = []
  if (req.body.fotosServicio && servicioAntiguo.fotosServicio.length === 0){
      newImages = []
  } else if (typeof req.body.fotosServicio === 'string') {
      newImages = [ req.body.fotosServicio];
  } else {
      newImages = req.body.fotosServicio ? req.body.fotosServicio: []
  }
  let imagesToDelete = []
  for (const elemento of servicioAntiguo.fotosServicio) {
      if (newImages && !newImages.includes(elemento)) {
          imagesToDelete.push(elemento);
      }
    }
  for (const image of imagesToDelete){
      await deleteFileFromDrive(authClient,image);
  }
  let fotosServicioUrls = newImages;
  if (req.files && req.files['fotosServicio'] && req.files['fotosServicio'].length > 0) {
      const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
      const childFolder = 'fotos-servicios';
      for (const uploadedFile of req.files['fotosServicio']) {
          const watermarkedImageBuffer = await addWatermarkToImage(uploadedFile.buffer);
          if (watermarkedImageBuffer) {
              const file = await uploadFile(authClient, {
                  fieldname: 'fotosServicio',
                  originalname: uploadedFile.originalname,
                  encoding: uploadedFile.encoding,
                  mymetype: uploadedFile.mimetype, 
                  buffer: watermarkedImageBuffer,
              }, folderName, childFolder);  
              const imagenesUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
              fotosServicioUrls.push(imagenesUrl);
          }
      }
  }

  const body = {
    ...req.body,
    fotosServicio: fotosServicioUrls,
  };

  const servicio = await Servicio.findOneAndUpdate({ _id: id }, { ...body });
  if (!servicio) {
    return res.status(400).json({ error: 'No existe ese servicio.' });
  }
  res.status(200).json(servicio);
};

const patchAllServicio = async (req, res) => {
  const updateResult = await Servicio.updateMany({}, { $set: req.body });
  if (updateResult.nModified === 0) {
    return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
  }
  res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
};

module.exports = {
  getServicio,
  getAllServicio,
  postServicio,
  deleteServicio,
  patchServicio,
  patchAllServicio,
};
