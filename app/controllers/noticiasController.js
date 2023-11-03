const Noticia = require('../models/noticiasModel');
const mongoose = require('mongoose');
const { authorize, uploadFile,deleteFileFromDrive,replaceFileInDrive,esURLGoogleDriveValida } = require('../storageMethods');
// Get Methods
const getNoticias = async(req,res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({error: 'No existe esa noticia.'})
    }
    const noticia = await Noticia.findById(id)
    if (!noticia) {
      return res.status(404).json({error: 'No existe esa noticia'})
    }
    res.status(200).json(noticia)
}
const getAllNoticias = async(req,res) =>{
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
    const noticias = await Noticia.find(busqueda)
    .sort(ordenacion)
    .limit(cantidad)    
    .skip(skipAmount);
    const noticiasCount = await Noticia.count()
    const data = {
        data: noticias,
        itemCounts: noticiasCount
    }
    res.status(200).json(data);
}

// Post Methods
const postNoticias = async(req,res) =>{
    const {
        titulo,
        publicador,
        categoria,
        citasBibliograficas,
        textoCompleto,
        fechaPublicacion
        } = req.body
    try {
        if (titulo === ""){
            return res.status(400).json({error: "No se puede crear una noticia sin un título"})
        }
        if (titulo.length >= 200){
            return res.status(400).json({error: "El título es muy largo. por favor usar un título más corto"})
        }
        if (titulo.length < 10){
            return res.status(400).json({error: "El título es muy corto. por favor usar un título más largo"})
        }

        if (categoria === "") {
            res.status(400).json({ error: "No pueden ingresarse categorías vacías." });
            return true;
        } else if (categoria.length >= 200) {
            res.status(400).json({ error: "Alguna categoría agregada es muy larga. Por favor, usa un nombre de categoría más corto." });
            return true;
        } else if (categoria.length < 3) {
            res.status(400).json({ error: "Alguna categoría agregada es muy corta. Por favor, usa un nombre de categoría más largo." });
            return true;
        }

        if (publicador === ""){
            return res.status(400).json({error: "No se puede crear una noticia sin un publicador"})
        }
        if (publicador.length >= 200){
            return res.status(400).json({error: "El nombre del publicador es muy largo. por favor usar un nombre del publicador más corto"})
        }
        if (publicador.length < 10){
            return res.status(400).json({error: "El nombre del publicador es muy corto. por favor usar un nombre del publicador más largo"})
        }
        
        if (!citasBibliograficas || citasBibliograficas.length === 0){
            return res.status(400).json({error: "Debe aportar al menos una referencia para crear una noticia"})
        }

        const authClient = await authorize();
        let imagenesURLs = []
        if (req.files && req.files['imagenes'] && req.files['imagenes'].length > 0) {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = 'fotos-noticias';
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
        if ( req.files && req.files['documentoComplementario'] &&  req.files['documentoComplementario'][0]){
            const uploadedFile = req.files['documentoComplementario'][0];
            if (uploadedFile.mimetype !== 'application/pdf'){
                return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder =  "documentos-noticias"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            documentosUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
        const noticiaNueva = 
        await Noticia.create({
            titulo,
            publicador,
            imagenes: imagenesURLs,
            categoria,
            citasBibliograficas,
            textoCompleto,  
            documentoComplementario: documentosUrl,
            fechaPublicacion
            })
        res.status(200).json(noticiaNueva);
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

// Delete Methods
const deleteNoticias = async(req,res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No existe esa noticia'})
    }
    const authClient = await authorize();
    const noticiaAntigua = await Noticia.findById(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'No existe esa Noticia'})
    }
    if (!noticiaAntigua) {
        return res.status(400).json({ error: 'No existe esa Noticia.' });
    }
    if (noticiaAntigua.imagenes && noticiaAntigua.imagenes.length > 0) {
        for (const fotoUrl of noticiaAntigua.imagenes) {
            await deleteFileFromDrive(authClient, fotoUrl);
        }
    }
    if(noticiaAntigua.documentoComplementario !== ""){
        const pathArchivoUrl = noticiaAntigua.documentoComplementario;
        await deleteFileFromDrive(authClient,pathArchivoUrl);
    }
    const noticia = await Noticia.findOneAndDelete({_id: id})
    if(!noticia) {  
      return res.status(400).json({error: 'No existe esa noticia'})
    }
    res.status(200).json(noticia)
}

// Patch Methods
const patchNoticias = async(req,res) =>{
    const { id } = req.params

    if (req.body.titulo === ""){
        return res.status(400).json({error: "No se puede editar una noticia sin un título"})
    }
    if (req.body.titulo.length >= 200){
        return res.status(400).json({error: "El título es muy largo. por favor usar un título más corto"})
    }
    if (req.body.titulo.length < 10){
        return res.status(400).json({error: "El título es muy corto. por favor usar un título más largo"})
    }
    if (req.body.categoria.some((string) => {
        if (string === "") {
            res.status(400).json({ error: "No pueden ingresarse categorías vacías." });
            return true;
        } else if (string.length >= 200) {
            res.status(400).json({ error: "Alguna categoría agregada es muy larga. Por favor, usa un nombre de categoría más corto." });
            return true;
        } else if (string.length < 5) {
            res.status(400).json({ error: "Alguna categoría agregada es muy corta. Por favor, usa un nombre de categoría más largo." });
            return true;
        }
    }));

    if (req.body.publicador === ""){
        return res.status(400).json({error: "No se puede editar una noticia sin un publicador"})
    }
    if (req.body.publicador.length >= 200){
        return res.status(400).json({error: "El nombre del publicador es muy largo. por favor usar un nombre del publicador más corto"})
    }
    if (req.body.publicador.length < 10){
        return res.status(400).json({error: "El nombre del publicador es muy corto. por favor usar un nombre del publicador más largo"})
    }

    if (!req.body.citasBibliograficas || req.body.citasBibliograficas.length === 0){
        return res.status(400).json({error: "Debe aportar al menos una referencia para editar una noticia"})
    }

    const authClient = await authorize();
    const noticiaAntigua = await Noticia.findById(id);
    if (!noticiaAntigua) {
      return res.status(400).json({ error: 'No existe ese Noticia.' });
  }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({error: 'No existe  ese Noticia.'})
    }

    let newdocumentosURL = ""
    if (req.files && req.files['documentoComplementario'] && req.files['documentoComplementario'][0]) {
        const newdocumentos= req.files['documentoComplementario'][0];
        if (newdocumentos.mimetype !== 'application/pdf'){
            return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
        }
        if (noticiaAntigua.documentoComplementario && esURLGoogleDriveValida(noticiaAntigua.documentoComplementario)) {
            newdocumentosURL = await replaceFileInDrive(authClient,newdocumentos, noticiaAntigua.documentoComplementario ,"documentos-Noticias");
            newdocumentosURL = `https://drive.google.com/uc?id=${newdocumentosURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "documentos-noticias";
            const file = await uploadFile(authClient, newdocumentos, folderName, childFolder);
            newdocumentosURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    } else {
        if (noticiaAntigua.documentoComplementario && req.body.documentoComplementario !== noticiaAntigua.documentoComplementario  && esURLGoogleDriveValida(noticiaAntigua.documentoComplementario) ) 
        {
            await deleteFileFromDrive(authClient,noticiaAntigua.documentoComplementario);
        }
    }

    let newImages = []
    if (typeof req.body.imagenes === 'string') {
        newImages = [ req.body.imagenes];
    } else {
        newImages = req.body.imagenes ? req.body.imagenes: []
    }
    let imagesToDelete = []
    for (const elemento of noticiaAntigua.imagenes) {
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
        const childFolder = 'fotos-noticias';
        for (const uploadedFile of req.files['imagenes']) {
            if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
            }
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            const imagenesUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
            imagenesUrls.push(imagenesUrl);
        }
    }

    const noticia = await Noticia.findOneAndUpdate({_id: id}, {
        ...req.body,
        documentoComplementario: req.files && req.files['documentoComplementario'] && req.files['documentoComplementario'][0] ? newdocumentosURL : req.body.documentoComplementario,
        imagenes: imagenesUrls
    })
    if (!noticia) {
        return res.status(400).json({error: 'No existe esa noticia.'})
    }
    res.status(200).json(noticia)   
}

const patchAllNoticias = async(req,res) =>{
    const updateResult = await Noticia.updateMany(
        {}, 
        { $set: req.body } 
    );
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
    }
    res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
}

module.exports = {
    getNoticias,
    getAllNoticias,
    postNoticias,
    deleteNoticias,
    patchNoticias,
    patchAllNoticias
}