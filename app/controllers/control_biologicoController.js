const ControlBiologico = require('../models/control_biologicoModel');
const mongoose = require('mongoose');
const { authorize, uploadFile, deleteFileFromDrive, replaceFileInDrive,esURLGoogleDriveValida,addWatermarkToImage } = require('../storageMethods');

// Get Methods
const getControlBiologico = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No existe ese control biológico.' });
    }
    const controlBiologico = await ControlBiologico.findById(id);
    if (!controlBiologico) {
        return res.status(404).json({ error: 'No existe ese control biológico.' });
    }
    res.status(200).json(controlBiologico);
};



const getAllControlBiologico = async (req, res) => {
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
    const controlBiologico = await ControlBiologico.find(busqueda)
        .sort(ordenacion)
        .limit(cantidad)
        .skip(skipAmount);
    const controlBiologicoCount = await ControlBiologico.count();
    const data = {
        data: controlBiologico,
        itemCounts: controlBiologicoCount,
    };
    res.status(200).json(data);
};

// Post Methods
const postControlBiologico = async (req, res) => {
    const {
        nombreInvestigacion,
        encargados,
        fechaPublicacion,
        textoExplicativo,
    } = req.body;

    try {
        if (nombreInvestigacion === ""){
            return res.status(400).json({error: "No se puede crear una investigación de control biológico sin un nombre"})
        }
        if (nombreInvestigacion.length >= 150){
            return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
        }
        if (nombreInvestigacion.length < 10){
            return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
        }
        
        if (encargados.length === 0){
            return res.status(400).json({error: "Debe agregar mínimo un encargado a una investigación de control biológico"})
        }
        const authClient = await authorize();
        let imagenesUrls = [];
        if (req.files && req.files['imagenes']  && req.files['imagenes'].length > 0) {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = 'fotos-control-biologico';
            for (const uploadedFile of req.files['imagenes']) {
                const watermarkedImageBuffer = await addWatermarkToImage(uploadedFile.buffer);
                if (watermarkedImageBuffer) {
                    const file = await uploadFile(authClient, {
                        fieldname: 'imagenes',
                        originalname: uploadedFile.originalname,
                        encoding: uploadedFile.encoding,
                        mymetype: uploadedFile.mimetype, 
                        buffer: watermarkedImageBuffer,
                    }, folderName, childFolder);  
                    const imagenUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
                    imagenesUrls.push(imagenUrl);
                }   

            }
        }
        let documentoURL = "";
        if (req.files && req.files['documentoDetallado']  && req.files['documentoDetallado'][0]) {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "documentos-control-biologico";
            const file = await uploadFile(authClient, req.files['documentoDetallado'][0], folderName, childFolder);
            documentoURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
        const controlBiologicoNuevo = await ControlBiologico.create({
            nombreInvestigacion,
            encargados,
            fechaPublicacion,
            textoExplicativo,
            imagenes: imagenesUrls,
            documentoDetallado: documentoURL,
        });

        res.status(200).json(controlBiologicoNuevo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Methods
const deleteControlBiologico = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No existe ese control biológico.' });
    }
    const controlBiologicoAntiguo = await ControlBiologico.findById(id);
    if (!controlBiologicoAntiguo) {
        return res.status(400).json({ error: 'No existe ese control biológico.' });
    }
    const authClient = await authorize();
    if (controlBiologicoAntiguo.imagenes && controlBiologicoAntiguo.imagenes.length > 0) {
        for (const imagenUrl of controlBiologicoAntiguo.imagenes) {
            await deleteFileFromDrive(authClient, imagenUrl);
        }
    }
    if (controlBiologicoAntiguo.documentoDetallado !== "") {
        const documentoDetalladoUrl = controlBiologicoAntiguo.documentoDetallado;
        await deleteFileFromDrive(authClient, documentoDetalladoUrl);
    }
    const controlBiologico = await ControlBiologico.findOneAndDelete({ _id: id });
    if (!controlBiologico) {
        return res.status(400).json({ error: 'No existe ese control biológico.' });
    }
    res.status(200).json(controlBiologico);
};

// Patch Methods
const patchControlBiologico = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No existe ese control biológico.' });
    }
    if (req.body.nombreInvestigacion === ""){
        return res.status(400).json({error: "No se puede editar una investigación de control biológico sin un nombre"})
    }
    if (req.body.nombreInvestigacion.length >= 150){
        return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.nombreInvestigacion.length < 10){
        return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
    }

    if (req.body.encargados.length === 0){
        return res.status(400).json({error: "Debe agregar mínimo un encargado a una investigación de control biológico"})
    }
    
    const authClient = await authorize();
    const controlBiologicoAntiguo = await ControlBiologico.findById(id);
    if (!controlBiologicoAntiguo) {
        return res.status(400).json({ error: 'No existe ese control biológico.' });
    }

    let newImages = []
    if (typeof req.body.imagenes === 'string') {
        newImages = [ req.body.imagenes];
    } else {
        newImages = req.body.imagenes ? req.body.imagenes: []
    }
    let imagesToDelete = []
    for (const elemento of controlBiologicoAntiguo.imagenes) {
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
        const childFolder = 'fotos-control-biologico';
        for (const uploadedFile of req.files['imagenes']) {
            const watermarkedImageBuffer = await addWatermarkToImage(uploadedFile.buffer);
            if (watermarkedImageBuffer) {
                const file = await uploadFile(authClient, {
                    fieldname: 'imagenes',
                    originalname: uploadedFile.originalname,
                    encoding: uploadedFile.encoding,
                    mymetype: uploadedFile.mimetype, 
                    buffer: watermarkedImageBuffer,
                }, folderName, childFolder);  
                const imagenesUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
                imagenesUrls.push(imagenesUrl);
            }
        }
    }

    let documentoDetalladoURL = controlBiologicoAntiguo.documentoDetallado || "";
    if (req.files && req.files['documentoDetallado'] && req.files['documentoDetallado'][0] && esURLGoogleDriveValida(controlBiologicoAntiguo.documentoDetallado)) {
        const newDocumentoDetallado = req.files['documentoDetallado'][0];
        if (controlBiologicoAntiguo.documentoDetallado) {
            documentoDetalladoURL = await replaceFileInDrive(authClient, newDocumentoDetallado, controlBiologicoAntiguo.documentoDetallado, "documentos-control-biologico");
            documentoDetalladoURL = `https://drive.google.com/uc?id=${documentoDetalladoURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "documentos-control-biologico";
            const file = await uploadFile(authClient, newDocumentoDetallado, folderName, childFolder);
            documentoDetalladoURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    }

    const body = {
        ...req.body,
        imagenes: imagenesUrls,
        documentoDetallado: req.files && req.files['documentoDetallado'] && req.files['documentoDetallado'][0] ?  documentoDetalladoURL : req.body.documentoDetallado
    };
    const controlBiologico = await ControlBiologico.findOneAndUpdate({ _id: id }, { ...body });
    if (!controlBiologico) {
        return res.status(400).json({ error: 'No existe ese control biológico.' });
    }
    res.status(200).json(controlBiologico);
};

const patchAllControlBiologico = async (req, res) => {
    const updateResult = await ControlBiologico.updateMany({}, { $set: req.body });
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
    }
    res.status(200).json({ message: 'Documentos de control biológico actualizados exitosamente.' });
};

module.exports = {
    getControlBiologico,
    getAllControlBiologico,
    postControlBiologico,
    deleteControlBiologico,
    patchControlBiologico,
    patchAllControlBiologico,
};
