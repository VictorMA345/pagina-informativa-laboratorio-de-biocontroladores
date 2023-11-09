const Estudiante = require('../models/estudiantesModel')
const Tesis = require('../models/tesisModel');
const mongoose = require('mongoose')
const { authorize, uploadFile,deleteFileFromDrive,replaceFileInDrive,esURLGoogleDriveValida,contieneSoloNumerosOSimbolos,esEmailValido } = require('../storageMethods');
// Get Methods
const getEstudiante = async(req,res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No existe ese estudiante.'})
    }
    const estudiante = await Estudiante.findById(id)
    if (!estudiante) {
      return res.status(404).json({error: 'No existe ese estudiante'})
    }
    res.status(200).json(estudiante)
}

const getAllEstudiantes = async(req,res) =>{
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
  
    if (req.query.startDate && req.query.endDate) {
        busqueda.createdAt = {
            $gte: new Date(req.query.startDate),
            $lt: new Date(req.query.endDate),
        };
    } else if (req.query.startDate) {
        busqueda.createdAt = {
            $gte: new Date(req.query.startDate),
        };
    } else if (req.query.endDate) {
        busqueda.createdAt = {
            $lt: new Date(req.query.endDate),
        };
    }
    const estudiantes = await Estudiante.find(busqueda)
    .sort(ordenacion)
    .limit(cantidad)
    .skip(skipAmount)
    const estudiantesCount = await Estudiante.count()
    const data = {
        data: estudiantes,
        itemCounts: estudiantesCount
    }
    res.status(200).json(data)
}

const getAllEstudiantesNames = async (req, res) => {
    try {
      const estudiantes = await Estudiante.find({}, '_id nombreCompleto');
      if (!estudiantes || estudiantes.length === 0) {
        return res.status(404).json({ error: 'No se encontraron estudiantes.' });
      }
      const estudiantesList = estudiantes.map((estudiante) => ({
        id: estudiante._id,
        nombre: estudiante.nombreCompleto,
      }));
      res.status(200).json(estudiantesList);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los estudiantes.' });
    }
  };
  
// Post Methods
const postEstudiantes = async(req,res) =>{
    const {
        carneEstudiante,
        cedula,
        nombreCompleto,
        carrera,
        genero,
        correoElectronico,
        anioIngreso,
        investigacion
        } = req.body
    try {

        if (carneEstudiante === ""){
            return res.status(400).json({error: "No se puede crear un estudiante sin un carné"})
        }
        if (carneEstudiante.length >= 20){
            return res.status(400).json({error: "El carné es muy largo. por favor usar un carné más corto"})
        }
        if (carneEstudiante.length < 5){
            return res.status(400).json({error: "El carné es muy corto. por favor usar un carné más largo"})
        }
        if (!contieneSoloNumerosOSimbolos(carneEstudiante)){
            return res.status(400).json({error: "El carné solo puede contener números o símbolos"})
        }
        
        if (cedula === ""){
            return res.status(400).json({error: "No se puede crear un estudiante sin una identificación"})
        }
        if (cedula.length >= 20){
            return res.status(400).json({error: "La identificación es muy larga. por favor usar una identificación más corta"})
        }
        if (cedula.length < 10){
            return res.status(400).json({error: "La identificación es muy corta. por favor usar una identificación más larga"})
        }
        if (!contieneSoloNumerosOSimbolos(cedula)){
            return res.status(400).json({error: "La identificación no tiene el formato correcto."})
        }

        if (investigacion === ""){
            return res.status(400).json({error: "No se puede crear un estudiante sin un nombre de la investigación"})
        }
        if (investigacion.length >= 150){
            return res.status(400).json({error: "El nombre de la investigación es muy largo. por favor usar un nombre más corto"})
        }
        if (investigacion.length < 10){
            return res.status(400).json({error: "El nombre de la investigación es muy corto. por favor usar un nombre más largo"})
        }
        if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(investigacion.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(investigacion)){
            return res.status(400).json({error: "La investigación no puede contener números o símbolos"})
        }

        if (nombreCompleto === ""){
            return res.status(400).json({error: "No se puede crear un estudiante sin un nombre"})
        }
        if (nombreCompleto.length >= 150){
            return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
        }
        if (nombreCompleto.length < 10){
            return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
        }
        if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(nombreCompleto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(nombreCompleto)){
            return res.status(400).json({error: "El nombre completo no puede contener números o símbolos"})
        }

        if (carrera === ""){
            return res.status(400).json({error: "No se puede crear un estudiante sin un nombre para la carrera universitaria"})
        }
        if (carrera.length >= 100){
            return res.status(400).json({error: "El nombre de la carrera universitaria es muy largo. por favor usar un nombre de la carrera universitaria más corto"})
        }
        if (carrera.length < 5){
            return res.status(400).json({error: "El nombre de la carrera universitaria es muy corto. por favor usar un nombre de la carrera universitaria más largo"})
        }
        if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(carrera.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(carrera)){
            return res.status(400).json({error: "El nombre de la carrera universitaria no puede contener números o símbolos"})
        }

        if (anioIngreso === ""){
            return res.status(400).json({error: "Ingrese un año válido."})
        }
        if (anioIngreso.length !== 4){
            return res.status(400).json({error: "Ingrese un año válido."})
        }
        if (!contieneSoloNumerosOSimbolos(anioIngreso)){
            return res.status(400).json({error: "Ingrese un año válido."})
        }

        if (correoElectronico === ""){
            return res.status(400).json({error: "No se puede crear un estudiante sin un correo electrónico válido."})
        }
        if (correoElectronico.length >= 40){
            return res.status(400).json({error: "El correo electrónico es muy largo. por favor usar un  correo electrónico más corto"})
        }
        if(!esEmailValido(correoElectronico)){
            return res.status(400).json({error: "El correo electrónico no tiene el formato correcto"})
        }

        const authClient = await authorize();
        let fotoPerfilUrl = "";
        if (req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0]){
            const uploadedFile = req.files['fotoPerfil'][0];
            if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "fotos-estudiantes"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            fotoPerfilUrl = `https://drive.google.com/uc?id=${file['data'].id}`
        }
        let curriculumUrl = "";
        if (req.files && req.files['curriculum'] && req.files['curriculum'][0]){
            const uploadedFile = req.files['curriculum'][0];
            if (uploadedFile.mimetype !== 'application/pdf'){
                return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder =  "curriculums-estudiantes"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            curriculumUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
        const estudianteNuevo = 
        await Estudiante.create({
            carneEstudiante,
            cedula,
            nombreCompleto,
            fotoPerfil: fotoPerfilUrl,
            carrera,
            genero,
            investigacion,
            correoElectronico,
            anioIngreso,
            curriculum: curriculumUrl
            })
        res.status(200).json(estudianteNuevo);
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// Delete Methods
const deleteEstudiante = async(req,res) =>{
    const { id } = req.params
    const estudianteAntiguo = await Estudiante.findById(id)
    if (!estudianteAntiguo) {
        return res.status(400).json({ error: 'No existe ese estudiante' });
    }
    const tesisConEstudiante = await Tesis.find({ estudiantesParticipantes: id });
    const hasTesisWithOneEncargado = tesisConEstudiante.some(tesis => tesis.estudiantesParticipantes.length === 1);

    if (hasTesisWithOneEncargado){
        return res.status(400).json({ error: `Eliminar este estudiante dejaría sin encargados a alguna tesis` });
    }


    const authClient = await authorize();
    if(estudianteAntiguo.fotoPerfil !== ""){
        const fotoPerfilUrl = estudianteAntiguo.fotoPerfil;
        await deleteFileFromDrive(authClient,fotoPerfilUrl);
    }
    if(estudianteAntiguo.curriculum !== ""){
        const curriculumUrl = estudianteAntiguo.curriculum;
        await deleteFileFromDrive(authClient,curriculumUrl);
    }   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No existe ese estudiante'})
    }


    const estudiante = await Estudiante.findOneAndDelete({_id: id})

    await Tesis.updateMany(
        { estudiantesParticipantes: id },
        { $pull: { estudiantesParticipantes: id } }
    );
    if(!estudiante) {
      return res.status(400).json({error: 'No existe esa enfermedad'})
    }
    res.status(200).json(estudiante)
}

// Patch Methods
const patchEstudiantes = async (req, res) => {
    const { id } = req.params;

    if (req.body.carneEstudiante === ""){
        return res.status(400).json({error: "No se puede editar un estudiante sin un carné"})
    }
    if (req.body.carneEstudiante.length >= 20){
        return res.status(400).json({error: "El carné es muy largo. por favor usar un carné más corto"})
    }
    if (req.body.carneEstudiante.length < 5){
        return res.status(400).json({error: "El carné es muy corto. por favor usar un carné más largo"})
    }
    if (!contieneSoloNumerosOSimbolos(req.body.carneEstudiante)){
        return res.status(400).json({error: "El carné solo puede contener números o símbolos"})
    }
    
    if (req.body.cedula === ""){
        return res.status(400).json({error: "No se puede editar un estudiante sin una identificación"})
    }
    if (req.body.cedula.length >= 20){
        return res.status(400).json({error: "La identificación es muy larga. por favor usar una identificación más corta"})
    }
    if (req.body.cedula.length < 10){
        return res.status(400).json({error: "La identificación es muy corta. por favor usar una identificación más larga"})
    }
    if (!contieneSoloNumerosOSimbolos(req.body.cedula)){
        return res.status(400).json({error: "La identificación no tiene el formato correcto."})
    }

    if (req.body.investigacion === ""){
        return res.status(400).json({error: "No se puede editar un estudiante sin un nombre de la investigación"})
    }
    if (req.body.investigacion.length >= 150){
        return res.status(400).json({error: "El nombre de la investigación es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.investigacion.length < 10){
        return res.status(400).json({error: "El nombre de la investigación es muy corto. por favor usar un nombre más largo"})
    }
    if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(req.body.investigacion.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(req.body.investigacion)){
        return res.status(400).json({error: "La investigación no puede contener números o símbolos"})
    }



    if (req.body.nombreCompleto === ""){
        return res.status(400).json({error: "No se puede editar un estudiante sin un nombre"})
    }
    if (req.body.nombreCompleto.length >= 150){
        return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.nombreCompleto.length < 10){
        return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
    }
    if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(req.body.nombreCompleto.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(req.body.nombreCompleto)){
        return res.status(400).json({error: "El nombre completo no puede contener números o símbolos"})
    }
    
    if (req.body.carrera === ""){
        return res.status(400).json({error: "No se puede editar un estudiante sin un nombre para la carrera universitaria"})
    }
    if (req.body.carrera.length >= 100){
        return res.status(400).json({error: "El nombre de la carrera universitaria es muy largo. por favor usar un nombre de la carrera universitaria más corto"})
    }
    if (req.body.carrera.length < 5){
        return res.status(400).json({error: "El nombre de la carrera universitaria es muy corto. por favor usar un nombre de la carrera universitaria más largo"})
    }
    if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(req.body.carrera.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(req.body.carrera)){
        return res.status(400).json({error: "El nombre de la carrera no puede contener números o símbolos"})
    }


    if (req.body.anioIngreso === ""){
        return res.status(400).json({error: "Ingrese un año válido."})
    }
    if (req.body.anioIngreso.length !== 4){
        return res.status(400).json({error: "Ingrese un año válido."})
    }
    if (!contieneSoloNumerosOSimbolos(req.body.anioIngreso)){
        return res.status(400).json({error: "Ingrese un año válido."})
    }

    if (req.body.correoElectronico === ""){
        return res.status(400).json({error: "No se puede editar un estudiante sin un correo electrónico válido."})
    }
    if (req.body.correoElectronico.length >= 40){
        return res.status(400).json({error: "El correo electrónico es muy largo. por favor usar un  correo electrónico más corto"})
    }
    if(!esEmailValido(req.body.correoElectronico)){
        return res.status(400).json({error: "El correo electrónico no tiene el formato correcto"})
    }

    const estudianteAntiguo = await Estudiante.findById(id);
    const authClient = await authorize();
    let newFotoDePerfilURL = "";
    if (req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0]) {
        const newFotoPerfil = req.files['fotoPerfil'][0];
        if (!['image/jpeg','image/png','image/jpg'].includes(newFotoPerfil.mimetype)){
            return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
        }
        if (estudianteAntiguo.fotoPerfil  && esURLGoogleDriveValida(estudianteAntiguo.fotoPerfil)) {
            newFotoDePerfilURL = await replaceFileInDrive(authClient, newFotoPerfil, estudianteAntiguo.fotoPerfil, "fotos-estudiantes");
            newFotoDePerfilURL = `https://drive.google.com/uc?id=${newFotoDePerfilURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "fotos-de-perfil";
            const file = await uploadFile(authClient, newFotoPerfil, folderName, childFolder);
            newFotoDePerfilURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    } else {
        if (estudianteAntiguo.fotoPerfil  && req.body.fotoPerfil !== estudianteAntiguo.fotoPerfil && esURLGoogleDriveValida(estudianteAntiguo.fotoPerfil) ) 
        {
            await deleteFileFromDrive(authClient,estudianteAntiguo.fotoPerfil);
        }
    }
    let newCurriculumURL = estudianteAntiguo.curriculum || "";
    if (req.files && req.files['curriculum'] && req.files['curriculum'][0]) {
        const newCurriculum = req.files['curriculum'][0];
        if (newCurriculum.mimetype !== 'application/pdf'){
            return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
        }
        if (estudianteAntiguo.curriculum && esURLGoogleDriveValida(estudianteAntiguo.curriculum) ) {
            newCurriculumURL = await replaceFileInDrive(authClient, newCurriculum, estudianteAntiguo.curriculum, "curriculums-estudiantes");
            newCurriculumURL = `https://drive.google.com/uc?id=${newCurriculumURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "curriculums-estudiantes";
            const file = await uploadFile(authClient, newCurriculum, folderName, childFolder);
            newCurriculumURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    }
    const body = {
        ...req.body,
        curriculum: req.files && req.files['curriculum'] && req.files['curriculum'][0] ? newCurriculumURL : req.body.curriculum,
        fotoPerfil: req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0] ? newFotoDePerfilURL : req.body.fotoPerfil
    };
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No existe ese estudiante.' });
    }   
    const estudiante = await Estudiante.findOneAndUpdate({ _id: id }, {
        ...body
    });
    if (!estudiante) {
        return res.status(400).json({ error: 'No existe ese estudiante.' });
    }
    res.status(200).json(estudiante);
}


const patchAllEstudiantes = async(req,res) =>{
    const updateResult = await Estudiante.updateMany(
        {}, 
        { $set: req.body } 
    );
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
    }
    res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
}

module.exports = {
    getEstudiante,
    getAllEstudiantes,
    getAllEstudiantesNames,
    postEstudiantes,
    deleteEstudiante,
    patchEstudiantes,
    patchAllEstudiantes
}