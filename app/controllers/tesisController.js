const Tesis = require('../models/tesisModel');
const mongoose = require('mongoose');
const { authorize, uploadFile, deleteFileFromDrive, replaceFileInDrive,esURLGoogleDriveValida,contieneSoloNumerosOSimbolos } = require('../storageMethods');

    // Get Methods
const getTesis = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No existe esa tesis.' });
    }
    const tesis = await Tesis.findById(id);
    if (!tesis) {
        return res.status(404).json({ error: 'No existe esa tesis.' });
    }
    res.status(200).json(tesis);
};

const getAllTesis = async (req, res) => {
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
    const tesis = await Tesis.find(busqueda)
        .sort(ordenacion)
        .limit(cantidad)
        .skip(skipAmount);
    const tesisCount = await Tesis.countDocuments();
    const data = {
        data: tesis,
        itemCounts: tesisCount,
    };
    res.status(200).json(data);
};

// Post Methods
const postTesis = async (req, res) => {
    const {
        tituloTesis,
        resumenTesis,
        abstract,
        citasReferencias,
        estadoTesis,
        fechaInicio,
        fechaFinalizacion,
        palabrasClave,
        gradoObtenido,
        estudiantesParticipantes,
        anioTesis,
        empresasParticipantes,
        financiamiento,
        miembrosComite,
        nombreComite,
    } = req.body;
    try {

        if (tituloTesis === ""){
            return res.status(400).json({error: "No se puede crear una tesis sin un nombre"})
        }
        if (tituloTesis.length >= 150){
            return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
        }
        if (tituloTesis.length < 5){
            return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
        }  

        if(!fechaInicio){
            return res.status(400).json({error: "Es necesario poner una fecha de inicio."})
        }
        if (fechaFinalizacion && fechaFinalizacion <= fechaInicio){
            return res.status(400).json({error: "Las fechas de la tesis son incorrectas."})
        }

        if(!fechaFinalizacion && (estadoTesis === "Finalizada" || estadoTesis === "Suspendida")){
            return res.status(400).json({error: "Se debe poner una fecha de finalización a una tesis finalizada"})
        }
        if(fechaFinalizacion && estadoTesis === "En ejecución"){
            return res.status(400).json({error: "No se puede asignar una fecha de finalización a una tesis en ejecución"})
        }

        if (!citasReferencias || citasReferencias.length === 0){
            return res.status(400).json({error: "Debe aportar al menos una referencia para crear una tesis."})
        }

        if (gradoObtenido === ""){
            return res.status(400).json({error: "No se puede crear una tesis sin un grado obtenido."})
        }
        if (gradoObtenido.length >= 100){
            return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
        }
        if (gradoObtenido.length < 5){
            return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
        }  

        if (anioTesis === ""){
            return res.status(400).json({error: "Ingrese un año válido."})
        }
        if (anioTesis.length !== 4){
            return res.status(400).json({error: "Ingrese un año válido."})
        }
        if (!contieneSoloNumerosOSimbolos(anioTesis)){
            return res.status(400).json({error: "Ingrese un año válido."})
        }

        if (financiamiento.length >= 150){
            return res.status(400).json({error: "El texto del financiamiento es muy largo. por favor usar un texto del financiamiento más corto"})
        }
        
        if (nombreComite === ""){
            return res.status(400).json({error: "No se puede crear una tesis sin un nombre de comité"})
        }
        if (nombreComite.length >= 150){
            return res.status(400).json({error: "El nombre de comité es muy largo. por favor usar un nombre de comité más corto"})
        }
        if (nombreComite.length < 5){
            return res.status(400).json({error: "El nombre de comité es muy corto. por favor usar un nombre de comité más largo"})
        }  
        

        let miembrosComiteList = miembrosComite;
        if (typeof miembrosComite === 'string'){
            miembrosComiteList = [miembrosComite]
        }
        if (!miembrosComite || miembrosComite.length === 0){
            return res.status(400).json({error: "Debe agregar mínimo un miembro del comité"})
        }
        if (miembrosComiteList.some((string) => {
            if (string === "") {
                res.status(400).json({ error: "No pueden ingresarse miembros del comité vacías." });
                return true;
            } else if (string.length >= 200) {
                res.status(400).json({ error: "Algún miembro del comité agregado es muy larga. Por favor, usa un miembro del comité más corto." });
                return true;
            } else if (string.length < 5) {
                res.status(400).json({ error: "Algún miembro del comité agregado es muy corta. Por favor, usa un miembro del comité más largo." });
                return true;
            }
        }));
        let estudiantesParticipantesList = estudiantesParticipantes;
        if (typeof estudiantesParticipantes === 'string'){
            estudiantesParticipantesList = [estudiantesParticipantes]
        }
        if (!estudiantesParticipantes || estudiantesParticipantes.length === 0){
            return res.status(400).json({error: "Debe agregar mínimo un estudiante participante"})
        }
        if (estudiantesParticipantesList.some((string) => {
            if (string === "") {
                res.status(400).json({ error: "No pueden ingresarse nombres de estudiantes vacíos." });
                return true;
            } else if (string.length >= 200) {
                res.status(400).json({ error: "Algún estudiante del comité agregado es muy larga. Por favor, usa un nombre del estudiante más corto." });
                return true;
            } else if (string.length < 5) {
                res.status(400).json({ error: "Algún estudiante del comité agregado es muy corta. Por favor, usa un nombre del estudiante más largo." });
                return true;
            }
        }));
        const authClient = await authorize();

        let documentoTesisURL = "";
        if (req.files && req.files['pathArchivo'] && req.files['pathArchivo'][0]){
            const uploadedFile = req.files['pathArchivo'][0];
            if (uploadedFile.mimetype !== 'application/pdf'){
                return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder =  "documentos-tesis"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            documentoTesisURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        } else{
            res.status(400).json({ error: "No se Ingresó ningún documento de tesis." });
        }

        let imagenesExtrasUrls = []
        if (req.files && req.files['imagenesExtras'] && req.files['imagenesExtras'].length > 0) {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = 'fotos-tesis-extras';
            for (const uploadedFile of req.files['imagenesExtras']) {
                if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                    return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
                }
                const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
                const imagenesExtrasUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
                imagenesExtrasUrls.push(imagenesExtrasUrl);
            }
        }
        let pathFotoTituloUrl = "";
        if (req.files && req.files['pathFotoTitulo'] && req.files['pathFotoTitulo'][0]){
            const uploadedFile = req.files['pathFotoTitulo'][0];
            if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "fotos-tesis-titulos"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            pathFotoTituloUrl = `https://drive.google.com/uc?id=${file['data'].id}`
        }

        const tesisNueva = await Tesis.create({
        tituloTesis,
        resumenTesis,
        abstract,
        pathFotoTitulo: pathFotoTituloUrl,
        imagenesExtras: imagenesExtrasUrls,
        pathArchivo: documentoTesisURL,
        citasReferencias,
        estadoTesis,
        fechaInicio,
        fechaFinalizacion,
        palabrasClave,
        gradoObtenido,
        estudiantesParticipantes,
        anioTesis,
        empresasParticipantes,
        financiamiento,
        miembrosComite,
        nombreComite
        });
        res.status(200).json(tesisNueva);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Methods
const deleteTesis = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No existe esa tesis.' });
    }
    const tesisAntigua = await Tesis.findById(id);
    if (!tesisAntigua) {
        return res.status(400).json({ error: 'No existe esa tesis.' });
    }
    const authClient = await authorize();
    if (tesisAntigua.imagenesExtras && tesisAntigua.imagenesExtras.length > 0) {
        for (const fotoTesisUrl of tesisAntigua.imagenesExtras) {
            await deleteFileFromDrive(authClient, fotoTesisUrl);
        }
    }
    if(tesisAntigua.pathArchivo !== ""){
        const pathArchivoUrl = tesisAntigua.pathArchivo;
        await deleteFileFromDrive(authClient,pathArchivoUrl);
    }
    if(tesisAntigua.pathFotoTitulo !== ""){
        const pathFotoTituloUrl = tesisAntigua.pathFotoTitulo;
        await deleteFileFromDrive(authClient,pathFotoTituloUrl);
    }
    const tesis = await Tesis.findOneAndDelete({ _id: id });
    if (!tesis) {
        return res.status(400).json({ error: 'No existe esa tesis.' });
    }
    res.status(200).json(tesis);
};

// Patch Methods
const patchTesis = async (req, res) => {
    const { id } = req.params;

    if (req.body.tituloTesis === ""){
        return res.status(400).json({error: "No se puede editar una tesis sin un nombre"})
    }
    if (req.body.tituloTesis.length >= 150){
        return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.tituloTesis.length < 5){
        return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
    }  

    if(!req.body.fechaInicio){
        return res.status(400).json({error: "Es necesario poner una fecha de inicio."})
    }
    if (req.body.fechaFinalizacion && req.body.fechaFinalizacion <= req.body.fechaInicio){
        return res.status(400).json({error: "Las fechas de la tesis son incorrectas."})
    }

    if(!req.body.fechaFinalizacion && (req.body.estadoTesis === "Finalizada" || req.body.estadoTesis === "Suspendida")){
        return res.status(400).json({error: "Se debe poner una fecha de finalización a una tesis finalizada"})
    }
    if(req.body.fechaFinalizacion && req.body.estadoTesis === "En ejecución"){
        return res.status(400).json({error: "No se puede asignar una fecha de finalización a una tesis en ejecución"})
    }

    if (!req.body.citasReferencias || req.body.citasReferencias.length === 0){
        return res.status(400).json({error: "Debe aportar al menos una referencia para editar una tesis."})
    }

    if (req.body.gradoObtenido === ""){
        return res.status(400).json({error: "No se puede editar una tesis sin un grado obtenido"})
    }
    if (req.body.gradoObtenido.length >= 100){
        return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.gradoObtenido.length < 5){
        return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
    }  

    if (req.body.anioTesis === ""){
        return res.status(400).json({error: "Ingrese un año válido."})
    }
    if (req.body.anioTesis.length !== 4){
        return res.status(400).json({error: "Ingrese un año válido."})
    }
    if (!contieneSoloNumerosOSimbolos(req.body.anioTesis)){
        return res.status(400).json({error: "Ingrese un año válido."})
    }

    if (req.body.financiamiento.length >= 150){
        return res.status(400).json({error: "El texto del financiamiento es muy largo. por favor usar un texto del financiamiento más corto"})
    }
    
    if (req.body.nombreComite === ""){
        return res.status(400).json({error: "No se puede crear una tesis sin un nombre de comité"})
    }
    if (req.body.nombreComite.length >= 150){
        return res.status(400).json({error: "El nombre de comité es muy largo. por favor usar un nombre de comité más corto"})
    }
    if (req.body.nombreComite.length < 5){
        return res.status(400).json({error: "El nombre de comité     es muy corto. por favor usar un nombre de comité más largo"})
    }  
    if (!req.body.miembrosComite){
        res.status(400).json({ error: "Debe agregarse mínimo un miembro del comité evaluador." });
    }
    let miembrosComiteList = req.body.miembrosComite;
    if (typeof req.body.miembrosComite === 'string'){
        estudiantesParticipantesList = [req.body.miembrosComite]
    }
    if (!req.body.miembrosComite || req.body.miembrosComite.length === 0){
        return res.status(400).json({error: "Debe agregar mínimo un miembro de cómite"})
    }
    if (miembrosComiteList.some((string) => {
        if (string === "") {
            res.status(400).json({ error: "No pueden ingresarse miembros del comité vacías." });
            return true;
        } else if (string.length >= 200) {
            res.status(400).json({ error: "Algún miembro del comité agregado es muy larga. Por favor, usa un miembro del comité más corto." });
            return true;
        } else if (string.length < 5) {
            res.status(400).json({ error: "Algún miembro del comité agregado es muy corta. Por favor, usa un miembro del comité más largo." });
            return true;
        }
    }));
    let estudiantesParticipantesList = req.body.estudiantesParticipantes;
    if (typeof req.body.estudiantesParticipantes === 'string'){
        estudiantesParticipantesList = [req.body.estudiantesParticipantes]
    }
    if (!req.body.estudiantesParticipantes || req.body.estudiantesParticipantes.length === 0){
        return res.status(400).json({error: "Debe agregar mínimo un estudiante participante"})
    }
    if (estudiantesParticipantesList.some((string) => {
        if (string === "") {
            res.status(400).json({ error: "No pueden ingresarse nombres de estudiantes vacíos." });
            return true;
        } else if (string.length >= 200) {
            res.status(400).json({ error: "Algún estudiante agregado es muy larga. Por favor, usa un estudiante más corto." });
            return true;
        } else if (string.length < 5) {
            res.status(400).json({ error: "Algún estudiante agregado es muy corta. Por favor, usa un estudiante más largo." });
            return true;
        }
    }));
    const authClient = await authorize();
    const tesisAntigua = await Tesis.findById(id);
    if (!tesisAntigua) {
        return res.status(400).json({ error: 'No existe esa tesis.' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No existe esa tesis.' });
    }
    let newpathFotoTituloURL = ""
    if (req.files && req.files['pathFotoTitulo'] && req.files['pathFotoTitulo'][0]) {
        const newpathFotoTitulo= req.files['pathFotoTitulo'][0];
        if (!['image/jpeg','image/png','image/jpg'].includes(newpathFotoTitulo.mimetype)){
            return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
        }
        if (tesisAntigua.pathFotoTitulo && esURLGoogleDriveValida(tesisAntigua.pathFotoTitulo)) {
            newpathFotoTituloURL = await replaceFileInDrive(authClient,newpathFotoTitulo, tesisAntigua.pathFotoTitulo ,"fotos-tesis-titulos");
            newpathFotoTituloURL = `https://drive.google.com/uc?id=${newpathFotoTituloURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "fotos-tesis-titulos";
            const file = await uploadFile(authClient, newpathFotoTitulo, folderName, childFolder);
            newpathFotoTituloURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }   
    } else {
        if (tesisAntigua.pathFotoTitulo && req.body.pathFotoTitulo !== tesisAntigua.pathFotoTitulo  && esURLGoogleDriveValida(tesisAntigua.pathFotoTitulo) ) 
        {
            await deleteFileFromDrive(authClient,tesisAntigua.pathFotoTitulo);
        }
    }

    let pathArchivoURL = ""
    if (req.files && req.files['pathArchivo'] && req.files['pathArchivo'][0] ) {
        const newpathArchivo = req.files['pathArchivo'][0];
        if (newpathArchivo.mimetype !== 'application/pdf'){
            return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
        }
        if (tesisAntigua.pathArchivo && esURLGoogleDriveValida(tesisAntigua.pathArchivo)) {
            pathArchivoURL = await replaceFileInDrive(authClient, newpathArchivo ,tesisAntigua.pathArchivo,"documentos-tesis");
            pathArchivoURL = `https://drive.google.com/uc?id=${pathArchivoURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "documentos-tesis";
            const file = await uploadFile(authClient, newpathArchivo, folderName, childFolder);
            pathArchivoURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    }   

    let newImages = []
    if (typeof req.body.imagenesExtras === 'string') {
        newImages = [ req.body.imagenesExtras];
    } else {
        newImages = req.body.imagenesExtras ? req.body.imagenesExtras: []
    }
    let imagesToDelete = []
    for (const elemento of tesisAntigua.imagenesExtras) {
        if (newImages && !newImages.includes(elemento)) {
            imagesToDelete.push(elemento);
        }
      }
    for (const image of imagesToDelete){
        await deleteFileFromDrive(authClient,image);
    }
    let imagenesExtrasUrls = newImages;
    if (req.files && req.files['imagenesExtras'] && req.files['imagenesExtras'].length > 0) {
        const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
        const childFolder = 'fotos-tesis-extras';
        for (const uploadedFile of req.files['imagenesExtras']) {
            if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
            }
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            const imagenesExtrasUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
            imagenesExtrasUrls.push(imagenesExtrasUrl);
        }
    }

    const body = {
        ...req.body,
        pathFotoTitulo: req.files && req.files['pathFotoTitulo'] && req.files['pathFotoTitulo'][0] ? newpathFotoTituloURL : req.body.pathFotoTitulo,
        pathArchivo: req.files && req.files['pathArchivo'] && req.files['pathArchivo'][0] ? pathArchivoURL : req.body.pathArchivo,
        imagenesExtras: imagenesExtrasUrls
    };
    const tesis = await Tesis.findOneAndUpdate({ _id: id }, { ...body });
    if (!tesis) {
        return res.status(400).json({ error: 'No existe esa tesis.' });
    }
    res.status(200).json(body);
};

const patchAllTesis = async (req, res) => {
    const updateResult = await Tesis.updateMany({}, { $set: req.body });
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
    }
    res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
};

module.exports = {
    getTesis,
    getAllTesis,
    postTesis,
    deleteTesis,
    patchTesis,
    patchAllTesis,
};
