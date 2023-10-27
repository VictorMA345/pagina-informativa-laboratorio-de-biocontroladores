const Enfermedad = require("../models/enfermedadModel")
const mongoose = require('mongoose')
const { authorize, uploadFile, deleteFileFromDrive, replaceFileInDrive,esURLGoogleDriveValida,addWatermarkToImage } = require('../storageMethods');
// Get Methods
const getEnfermedad = async(req,res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No existe esa enfermedad'})
    }
    const enfermedad = await Enfermedad.findById(id)
    if (!enfermedad) {
      return res.status(404).json({error: 'No existe esa enfermedad'})
    }
    res.status(200).json(enfermedad)
}

const getAllEnfermedades = async(req,res) => {
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
    const enfermedades = await Enfermedad.find(busqueda)
    .sort(ordenacion)
    .limit(cantidad)
    .skip(skipAmount)
    const enfermedadesCount = await Enfermedad.count()
    const data = {
        data: enfermedades,
        itemCounts: enfermedadesCount
    }
    res.status(200).json(data)
}


// Post Methods
const postEnfermedad = async(req,res) => {
    const {
        enfermedad,
        cultivo,
        autor,  
        fitopatogeno,
        descripcion,
        } = req.body
    try {

        if (enfermedad === ""){
            return res.status(400).json({error: "No se puede crear una investigación sobre una enfermedad sin un nombre"})
        }
        if (enfermedad.length >= 150){
            return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
        }
        if (enfermedad.length < 4){
            return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
        }

        if (fitopatogeno === ""){
            return res.status(400).json({error: "No se puede crear una investigación sobre una enfermedad sin el nombre del fitopatogeno"})
        }
        if (fitopatogeno.length >= 150){
            return res.status(400).json({error: "El nombre del fitopatogeno es muy largo. por favor usar un nombre más corto"})
        }
        if (fitopatogeno.length < 5){
            return res.status(400).json({error: "El nombre del fitopatogeno es muy corto. por favor usar un nombre más largo"})
        }
        if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(fitopatogeno.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(fitopatogeno)){
            return res.status(400).json({error: "El nombre del fitopatogeno no puede tener números o símbolos"})
        }

        let cultivoList = req.body.cultivo;
        if (typeof req.body.cultivo === 'string'){
            cultivoList = [req.body.cultivo]
        }
        if (!cultivo || cultivo.length === 0){
            return res.status(400).json({error: "Debe agregar mínimo un cultivo afectado"})
        }
        if (cultivoList.some((string) => {
            if (string === "") {
                res.status(400).json({ error: "No pueden ingresarse cultivos vacíos." });
                return true;
            } else if (string.length >=  200) {
                res.status(400).json({ error: "Algún nombre de cultivo agregado es muy largo. Por favor, usa un nombre de cultivo más corto." });
                return true;
            } else if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(string)){
                res.status(400).json({ error: "Los nombres de cultivos no pueden tener símbolos o números" });
                return true;
            }
        }));


        let autorList = req.body.autor;
        if (typeof req.body.autor === 'string'){
            autorList = [req.body.autor]
        }
        if (!autor || autor.length === 0){
            return res.status(400).json({error: "Debe agregar mínimo un autor"})
        }
        if (autorList.some((string) => {
            if (string === "") {
                res.status(400).json({ error: "No pueden ingresarse autores vacíos." });
                return true;
            } else if (string.length >=  200) {
                res.status(400).json({ error: "Algún nombre del autor agregado es muy largo. Por favor, usa un nombre del autor más corto." });
                return true;
            } else if (string.length < 5) {
                res.status(400).json({ error: "Algún nombre del autor agregado es muy corto. Por favor, usa un nombre del autor más largo." });
                return true;
            } else if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(string)){
                res.status(400).json({ error: "Los nombres de autores no pueden tener símbolos o números" });
                return true;
            }
        }));
    
        const authClient = await authorize();
        let imagenesURLs = []
        if (req.files && req.files['imagenes'] && req.files['imagenes'].length > 0) {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = 'fotos-enfermedades';
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
                    imagenesURLs.push(imagenesUrl);
                }
            }
        }

        let documentoUrl = "";
        if ( req.files && req.files['documento'] &&  req.files['documento'][0]){
            const uploadedFile = req.files['documento'][0];
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder =  "documento-enfermedades"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            documentoUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
        }

        const enfermedadNueva = 
        await Enfermedad.create({
            enfermedad,
            cultivo,
            autor,
            fitopatogeno,
            descripcion,
            imagenes: imagenesURLs, 
            documento: documentoUrl
            })  
        res.status(200).json(enfermedadNueva);
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// Delete Methods
const deleteEnfermedad = async(req,res)=>{
    const { id } = req.params
    const authClient = await authorize();
    const enfermedadAntigua = await Enfermedad.findById(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No existe esa enfermedad'})
    }
    if (!enfermedadAntigua) {
        return res.status(400).json({ error: 'No existe esa enfermedad.' });
    }
    if (enfermedadAntigua.imagenes && enfermedadAntigua.imagenes.length > 0) {
        for (const fotoUrl of enfermedadAntigua.imagenes) {
            await deleteFileFromDrive(authClient, fotoUrl);
        }
    }
    if(enfermedadAntigua.documento !== ""){
        const pathArchivoUrl = enfermedadAntigua.documento;
        await deleteFileFromDrive(authClient,pathArchivoUrl);
    }
    const enfermedad = await Enfermedad.findOneAndDelete({_id: id})
    if(!enfermedad) {
      return res.status(400).json({error: 'No existe esa enfermedad'})
    }
    res.status(200).json(enfermedad)
}

// Patch Methods
const patchEnfermedad = async(req,res) => {
    const { id } = req.params

    if (req.body.enfermedad === ""){
        return res.status(400).json({error: "No se puede editar una investigación sobre una enfermedad sin un nombre"})
    }
    if (req.body.enfermedad.length >= 150){
        return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.enfermedad.length < 3){
        return res.status(400).json({error: "El nombre es muy corto. por favor usar un nombre más largo"})
    }
    
    if (req.body.fitopatogeno === ""){
        return res.status(400).json({error: "No se puede editar una investigación sobre una enfermedad sin el nombre del fitopatogeno"})
    }
    if (req.body.fitopatogeno.length >= 150){
        return res.status(400).json({error: "El nombre del fitopatogeno es muy largo. por favor usar un nombre más corto"})
    }
    if (req.body.fitopatogeno.length < 5){
        return res.status(400).json({error: "El nombre del fitopatogeno es muy corto. por favor usar un nombre más largo"})
    }
    if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(req.body.fitopatogeno.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(req.body.fitopatogeno)){
        return res.status(400).json({error: "El nombre del fitopatogeno no puede tener números o símbolos"})
    }

    let cultivoList = req.body.cultivo;
    if (typeof req.body.cultivo === 'string'){
        cultivoList = [req.body.cultivo]
    }
    if (!req.body.cultivo || req.body.cultivo.length === 0){
        return res.status(400).json({error: "Debe agregar mínimo un cultivo afectado"})
    }
    if (cultivoList.some((string) => {
        if (string === "") {
            res.status(400).json({ error: "No pueden ingresarse cultivos vacíos." });
            return true;
        } else if (string.length >=  200) {
            res.status(400).json({ error: "Algún nombre de cultivo agregado es muy largo. Por favor, usa un nombre de cultivo más corto." });
            return true;
        } else if (string.length < 2) {
            res.status(400).json({ error: "Algún nombre de cultivo agregado es muy corto. Por favor, usa un nombre de cultivo más largo." });
            return true;
        }else if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(string)){
            res.status(400).json({ error: "Los nombres de cultivos no pueden tener símbolos o números" });
            return true;
        }
    }));

    let autorList = req.body.autor;
    if (typeof req.body.autor === 'string'){
        autorList = [req.body.autor]
    }
    if (!req.body.autor || req.body.autor.length === 0){
        return res.status(400).json({error: "Debe agregar mínimo un autor"})
    }
    if (autorList.some((string) => {
        if (string === "") {
            res.status(400).json({ error: "No pueden ingresarse autores vacíos." });
            return true;
        } else if (string.length >=  200) {
            res.status(400).json({ error: "Algún nombre del autor agregado es muy largo. Por favor, usa un nombre del autor más corto." });
            return true;
        } else if (string.length < 5) {
            res.status(400).json({ error: "Algún nombre del autor agregado es muy corto. Por favor, usa un nombre del autor más largo." });
            return true;
        }else if (/[^A-Za-z0-9\sáéíóúÁÉÍÓÚ]/.test(string.normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || /\d/.test(string)){
            res.status(400).json({ error: "Los nombres del autor no pueden tener símbolos o números" });
            return true;
        }
    }));

    const authClient = await authorize();
    const enfermedadAntigua = await Enfermedad.findById(id);
    if (!enfermedadAntigua) {
        return res.status(400).json({ error: 'No existe ese Enfermedad.' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No existe esa enfermedad.'})
    }

    let newdocumentoURL = ""
    if (req.files && req.files['documento'] && req.files['documento'][0]) {
        const newdocumento= req.files['documento'][0];
        if (enfermedadAntigua.documento && esURLGoogleDriveValida(enfermedadAntigua.documento)) {
            newdocumentoURL = await replaceFileInDrive(authClient,newdocumento, enfermedadAntigua.documento ,"documentos-enfermedades");
            newdocumentoURL = `https://drive.google.com/uc?id=${newdocumentoURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "   documentos-enfermedades";
            const file = await uploadFile(authClient, newdocumento, folderName, childFolder);
            newdocumentoURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    } else {
        if (enfermedadAntigua.documento && req.body.documento !== enfermedadAntigua.documento  && esURLGoogleDriveValida(enfermedadAntigua.documento) ) 
        {
            await deleteFileFromDrive(authClient,enfermedadAntigua.documento);
        }
    }

    let newImages = []
    if (!req.body.imagenes && enfermedadAntigua.length === 0){
        newImages = []
    } else if (typeof req.body.imagenes === 'string') {
        newImages = [ req.body.imagenes];
    } else {
        newImages = req.body.imagenes ? req.body.imagenes: []
    }
    let imagesToDelete = []
    for (const elemento of enfermedadAntigua.imagenes) {
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
        const childFolder = 'fotos-enfermedades';
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

    const enfermedad = await Enfermedad.findOneAndUpdate({_id: id}, {
        ...req.body,
        documento: req.files && req.files['documento'] && req.files['documento'][0] ? newdocumentoURL : req.body.documento,
        imagenes: imagenesUrls
    })
    if (!enfermedad) {
        return res.status(400).json({error: 'No such workout'})
    }
    res.status(200).json(enfermedad)      
}
const patchEnfermedades = async (req, res) => {
    const updateResult = await Enfermedad.updateMany(
        {}, 
        { $set: req.body } 
    );
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documento para actualizar.' });
    }
    res.status(200).json({ message: 'documento actualizados exitosamente.' });
};
module.exports = {
    getEnfermedad,
    getAllEnfermedades,
    postEnfermedad,
    deleteEnfermedad,
    patchEnfermedad,
    patchEnfermedades
};    