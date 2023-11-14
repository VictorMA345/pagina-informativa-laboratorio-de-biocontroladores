const mongoose = require('mongoose')
const Proyecto = require('../models/proyectosModel')
const Miembro = require('../models/miembrosModel')
const { authorize, uploadFile,deleteFileFromDrive,replaceFileInDrive,esURLGoogleDriveValida,contieneSoloNumerosOSimbolos } = require('../storageMethods');

// Get Methods
const getProyectos = async(req,res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No existe ese proyecto.'})
    }
    const proyecto = await Proyecto.findById(id)
    if (!proyecto) {
      return res.status(404).json({error: 'No existe ese proyecto'})
    }
    res.status(200).json(proyecto)  
}

const getAllProyectos = async(req,res) =>{
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
        busqueda.fechaInicio = {
            $gte: new Date(req.query.startDate),
            $lt: new Date(req.query.endDate),
        };
    } else if (req.query.startDate) {
        busqueda.fechaInicio = {
            $gte: new Date(req.query.startDate),
        };
    } else if (req.query.endDate) {
        busqueda.fechaInicio = {
            $lt: new Date(req.query.endDate),
        };  
    }
    const proyectos = await Proyecto.find(busqueda)
    .sort(ordenacion)
    .limit(cantidad)
    .skip(skipAmount);
    const proyectosCount = await Proyecto.count()
    const data = {
        data: proyectos,
        itemCounts: proyectosCount
    }
    res.status(200).json(data);
}

const getAllProjectNames = async (req, res) => {
    try {
      const projects = await Proyecto.find({}, '_id tituloProyecto');
      if (!projects || projects.length === 0) {
        return res.status(404).json({ error: 'No se encontraron proyectos.' });
      }
      const projectList = projects.map((project) => ({
        id: project._id,
        nombre: project.tituloProyecto,
      }));
  
      res.status(200).json(projectList);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los proyectos.' });
    }
  };

// Post Methods
const postProyectos = async(req,res) =>{

    const {
        investigadores,
        tituloProyecto,
        fechaInicio,
        fechaFinalizacion,
        referencias,
        financiamiento,
        resumenProyecto,
        anioProyecto,
        areasInvestigacion, 
        palabrasClave,
        } = req.body
    try {

        if (tituloProyecto === ""){
            return res.status(400).json({error: "No se puede crear un proyecto sin un nombre"})
        }
        if (tituloProyecto.length >= 150){
            return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
        }
        if (tituloProyecto.length < 5){
            return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
        }  

        if(!fechaInicio){
            return res.status(400).json({error: "Es necesario poner una fecha de inicio."})
        }
        if (fechaFinalizacion && fechaFinalizacion <= fechaInicio){
            return res.status(400).json({error: "Las fechas del proyecto son incorrectas."})
        }

        if (!referencias || referencias.length === 0){
            return res.status(400).json({error: "Debe aportar al menos una referencia para crear un proyecto."})
        }

        if (anioProyecto === ""){
            return res.status(400).json({error: "Ingrese un año válido."})
        }
        if (anioProyecto.length !== 4){
            return res.status(400).json({error: "Ingrese un año válido."})
        }
        if (!contieneSoloNumerosOSimbolos(anioProyecto)){
            return res.status(400).json({error: "Ingrese un año válido."})
        }

        const authClient = await authorize();
        let imagenesURLs = []   
        if (req.files && req.files['imagenes'] && req.files['imagenes'].length > 0) {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = 'fotos-proyectos';
            for (const uploadedFile of req.files['imagenes']) {
                if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                    return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
                }
                const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
                const imagenesUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
                imagenesURLs.push(imagenesUrl);
            }
        }

        let documentosUrl = "";
        if ( req.files && req.files['documentos'] &&  req.files['documentos'][0]){
            const uploadedFile = req.files['documentos'][0];
            if (uploadedFile.mimetype !== 'application/pdf'){
                return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder =  "documentos-proyectos"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            documentosUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
        const proyectoNuevo = 
        await Proyecto.create({
            investigadores,
            tituloProyecto,
            fechaInicio,
            fechaFinalizacion,
            referencias,
            imagenes: imagenesURLs,
            documentos: documentosUrl,
            financiamiento,
            resumenProyecto,
            anioProyecto,
            areasInvestigacion,
            palabrasClave
            })
        let investigadoresList = investigadores;
        if (typeof investigadores === 'string'){
            investigadoresList = [investigadores]
        }
        const miembros = await Miembro.find({ _id: { $in: investigadoresList.filter(investigador => investigador !== "") } });
    
        for (const miembro of miembros) {
            miembro.proyectosParticipacion.push(proyectoNuevo._id);
            miembro['__v'] = 0;
            await miembro.save();
        }

        res.status(200).json(proyectoNuevo);
        } catch (error){
            res.status(400).json({error: error.message})
        }
}

// Delete Methods
const deleteProyectos = async(req,res) =>{
    try{
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No existe ese proyecto'})
        }
        const authClient = await authorize();
        const proyectoAntiguo = await Proyecto.findById(id);
        if (!proyectoAntiguo) {
            return res.status(400).json({ error: 'No existe ese proyecto.' });
        }
        if (proyectoAntiguo.imagenes && proyectoAntiguo.imagenes.length > 0) {
            for (const fotoUrl of proyectoAntiguo.imagenes) {
                await deleteFileFromDrive(authClient, fotoUrl);
            }
        }
        if(proyectoAntiguo.documentos !== ""){
            const pathArchivoUrl = proyectoAntiguo.documentos;
            await deleteFileFromDrive(authClient,pathArchivoUrl);
        }
        const proyecto = await Proyecto.findOneAndDelete({_id: id})

        const investigadoresIds = proyecto.investigadores;
        await Miembro.updateMany(
        { _id: { $in: investigadoresIds } },
        { $pull: { proyectosParticipacion: id } }
        );
        if(!proyecto) {  
        return res.status(400).json({error: 'No existe ese proyecto'})
        }
        res.status(200).json(proyecto)
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// Patch Methods
const patchProyectos = async(req,res) =>{
    const { id } = req.params
    if (req.body.tituloProyecto === ""){
        return res.status(400).json({error: "No se puede crear un proyecto sin un nombre"})
    }
    if (req.body.tituloProyecto.length >= 150){
        return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.tituloProyecto.length < 5){
        return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
    }  

    if(!req.body.fechaInicio){
        return res.status(400).json({error: "Es necesario poner una fecha de inicio."})
    }
    if (req.body.fechaFinalizacion && req.body.fechaFinalizacion <= req.body.fechaInicio){
        return res.status(400).json({error: "Las fechas del proyecto son incorrectas."})
    }

    if (!req.body.referencias || req.body.referencias.length === 0){
        return res.status(400).json({error: "Debe aportar al menos una referencia para crear un proyecto."})
    }

    if (req.body.anioProyecto === ""){
        return res.status(400).json({error: "Ingrese un año válido."})
    }
    if (req.body.anioProyecto.length !== 4){
        return res.status(400).json({error: "Ingrese un año válido."})
    }
    if (!contieneSoloNumerosOSimbolos(req.body.anioProyecto)){
        return res.status(400).json({error: "Ingrese un año válido."})
    }
    try {
    const authClient = await authorize();
    const proyectoAntiguo = await Proyecto.findById(id);
    if (!proyectoAntiguo) {
      return res.status(400).json({ error: 'No existe ese proyecto.' });
  }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No existe  ese proyecto.'})
    }

    let newdocumentosURL = ""
    if (req.files && req.files['documentos'] && req.files['documentos'][0]) {
        const newdocumentos= req.files['documentos'][0];
        if (newdocumentos.mimetype !== 'application/pdf'){
            return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
        }
        if (proyectoAntiguo.documentos && esURLGoogleDriveValida(proyectoAntiguo.documentos)) {
            newdocumentosURL = await replaceFileInDrive(authClient,newdocumentos, proyectoAntiguo.documentos ,"documentos-proyectos");
            newdocumentosURL = `https://drive.google.com/uc?id=${newdocumentosURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "documentos-proyectos";
            const file = await uploadFile(authClient, newdocumentos, folderName, childFolder);
            newdocumentosURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    } else {
        if (proyectoAntiguo.documentos && req.body.documentos !== proyectoAntiguo.documentos  && esURLGoogleDriveValida(proyectoAntiguo.documentos) ) 
        {
            await deleteFileFromDrive(authClient,proyectoAntiguo.documentos);
        }
    }

    let newImages = []
    if (typeof req.body.imagenes === 'string') {
        newImages = [ req.body.imagenes];
    } else {
        newImages = req.body.imagenes ? req.body.imagenes: []
    }
    let imagesToDelete = []
    for (const elemento of proyectoAntiguo.imagenes) {
        if (newImages && !newImages.includes(elemento)) {
            imagesToDelete.push(elemento);
        }
      }
    for (const image of imagesToDelete){
        await deleteFileFromDrive(authClient,image);
    }
    let imagenesUrls = newImages;
    if (req.files && req.files['imagenes'] && req.files['imagenes'].length > 0) {
        const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
        const childFolder = 'fotos-proyectos';
        for (const uploadedFile of req.files['imagenes']) {
            if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
            }
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            const imagenesUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
            imagenesUrls.push(imagenesUrl);
        }
    }

    const proyecto = await Proyecto.findOneAndUpdate({_id: id}, {
        ...req.body,
        documentos: req.files && req.files['documentos'] && req.files['documentos'][0] ? newdocumentosURL : req.body.documentos,
        imagenes: imagenesUrls
    })

    const miembrosPrevios = proyectoAntiguo.investigadores;
    const miembrosNuevos = proyecto.investigadores;
    const miembrosRemovidos = miembrosPrevios.filter((miembro) => !miembrosNuevos.includes(miembro));

    await Miembro.updateMany(
      { _id: { $in: miembrosRemovidos } },
      { $pull: { proyectosParticipacion: id } }
    );


    let investigadoresList = req.body.investigadores;
    if (typeof req.body.investigadores === 'string'){
        investigadoresList = [req.body.investigadores]
    }
    const miembros = await Miembro.find({ _id: { $in: investigadoresList.filter(investigador => investigador !== "")}});
    for (const miembro of miembros) {
        miembro.proyectosParticipacion.push(id);
        miembro['__v'] = 0;
        await miembro.save();
    }
    if (!proyecto) {
        return res.status(400).json({error: 'No existe ese proyecto.'})
    }
    res.status(200).json(proyecto)   
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

const patchAllProyectos = async(req,res) =>{
    const updateResult = await Proyecto.updateMany(
        {}, 
        { $set: req.body } 
    );
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
    }
    res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
}

module.exports = {
    getProyectos,
    getAllProjectNames,
    getAllProyectos,
    postProyectos,
    deleteProyectos,
    patchProyectos,
    patchAllProyectos
}