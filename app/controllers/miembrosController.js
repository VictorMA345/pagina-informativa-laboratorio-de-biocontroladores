const Miembro = require('../models/miembrosModel');
const Proyecto = require('../models/proyectosModel');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const validator = require('validator')
const { authorize, uploadFile,deleteFileFromDrive,replaceFileInDrive,esURLGoogleDriveValida,contieneSoloNumerosOSimbolos,esEmailValido } = require('../storageMethods');
const createToken = (_id) =>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn: '3d'})
}
    // Get Methods
const getMiembro = async(req,res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No existe ese miembro.'})
    }
    const miembro = await Miembro.findById(id)
    if (!miembro) {
        return res.status(404).json({error: 'No existe ese miembro'})
    }
    res.status(200).json(miembro)
}
    
const getAllMiembro = async(req,res) =>{
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
    const miembros = await Miembro.find(busqueda)
    .sort(ordenacion)
    .limit(cantidad)
    .skip(skipAmount)
    const miembrosCount = await Miembro.count()
    const data = {
        data: miembros,
        itemCounts: miembrosCount
    }
    res.status(200).json(data)
}

const getAllMiembrosNames = async (req, res) => {
    try {
      const miembros = await Miembro.find({}, '_id nombreCompleto');
      if (!miembros || miembros.length === 0) {
        return res.status(404).json({ error: 'No se encontraron miembros.' });
      }
      const miembrosList = miembros.map((miembro) => ({
        id: miembro._id,
        nombre: miembro.nombreCompleto,
      }));
      res.status(200).json(miembrosList);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los miembros.' });
    }
  };

// Delete Methods
const deleteMiembro = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'No existe ese miembro' });
    }
    try {
        const miembro = await Miembro.findById(id)
        const authClient = await authorize();

        const proyectoConEstudiante = await Proyecto.find({ investigadores: id });
        const hasproyectoConUnEncargado = proyectoConEstudiante.some(proyecto => proyecto.investigadores.length === 1);
    
        if (hasproyectoConUnEncargado){
            return res.status(400).json({ error: `Eliminar este miembro dejaría sin encargados a algún proyecto` });
        }

        if (!miembro) {
            return res.status(400).json({ error: 'No existe ese miembro' });
        }
        if(miembro.fotoPerfil !== ""){
            const fotoPerfilUrl = miembro.fotoPerfil;
            await deleteFileFromDrive(authClient,fotoPerfilUrl);
        }
        if(miembro.curriculumDocumento !== ""){
            const curriculumUrl = miembro.curriculumDocumento;
            await deleteFileFromDrive(authClient,curriculumUrl);
        }
        const Deletedmiembro = await Miembro.findOneAndDelete({ _id: id });
        await Proyecto.updateMany(
            { investigadores: id },
            { $pull: { investigadores: id } }
        );
        res.status(200).json(Deletedmiembro);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el miembro' });
    }
};

// Patch Methods
const patchMiembro = async(req,res) =>{
    const { id } = req.params
    const miembroAntiguo = await Miembro.findById(id);

    let hash;
    if (miembroAntiguo.contrasena !== req.body.contrasena){
        if(!validator.isEmail( req.body.correo)){
            return res.status(400).json({error: "No se puede editar un miembro sin un nombre"})
        }
        if(!validator.isStrongPassword( req.body.contrasena)){
            return res.status(400).json({error: "La contraseña no es lo suficientemente fuerte"})
        }
        const salt = await bcrypt.genSalt(10);
        hash = await bcrypt.hash(req.body.contrasena, salt);
    }else{
        hash = req.body.contrasena
    }

    if (req.body.nombreCompleto === ""){
        return res.status(400).json({error: "No se puede editar un miembro sin un nombre"})
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
    
    if (req.body.correo === ""){
        return res.status(400).json({error: "No se puede editar un miembro sin un correo electrónico válido."})
    }
    if (req.body.correo.length >= 40){
        return res.status(400).json({error: "El correo electrónico es muy largo. por favor usar un  correo electrónico más corto"})
    }
    if(!esEmailValido(req.body.correo)){
        return res.status(400).json({error: "El correo electrónico no tiene el formato correcto"})
    }

    if (req.body.telefono.length >= 20){
        return res.status(400).json({error: "El número de teléfono es muy largo. por favor usar un número de teléfono más corto"})
    }
    if(!contieneSoloNumerosOSimbolos(req.body.telefono)){
        return res.status(400).json({error: "Los números de teléfono no pueden contener letras."})
    }

    const authClient = await authorize();
    let newFotoDePerfilURL = ""
    if (req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0] ) {
        const newFotoPerfil = req.files['fotoPerfil'][0];
        if (!['image/jpeg','image/png','image/jpg'].includes(newFotoPerfil.mimetype)){
            return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
        }
        if (miembroAntiguo.fotoPerfil && esURLGoogleDriveValida(miembroAntiguo.fotoPerfil) ) {
            newFotoDePerfilURL = await replaceFileInDrive(authClient, newFotoPerfil ,miembroAntiguo.fotoPerfil,"fotos-de-perfil");
            newFotoDePerfilURL = `https://drive.google.com/uc?id=${newFotoDePerfilURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "fotos-de-perfil";
            const file = await uploadFile(authClient, newFotoPerfil, folderName, childFolder);
            newFotoDePerfilURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    }else{
        if (miembroAntiguo.fotoPerfil && req.body.fotoPerfil !== miembroAntiguo.fotoPerfil  && esURLGoogleDriveValida(miembroAntiguo.fotoPerfil) ) 
        {
            await deleteFileFromDrive(authClient,miembroAntiguo.fotoPerfil);
        }
    }
    let newCurriculumDocumentoURL = ""
    if (req.files && req.files['curriculumDocumento'] && req.files['curriculumDocumento'][0]) {
        const newCurriculum = req.files['curriculumDocumento'][0];
        if (newCurriculum.mimetype !== 'application/pdf'){
            return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
        }
        if (miembroAntiguo.curriculumDocumento  && esURLGoogleDriveValida(miembroAntiguo.curriculumDocumento) ) {
            newCurriculumDocumentoURL = await replaceFileInDrive(authClient,newCurriculum, miembroAntiguo.curriculumDocumento ,"curriculums");
            newCurriculumDocumentoURL = `https://drive.google.com/uc?id=${newCurriculumDocumentoURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "curriculums";
            const file = await uploadFile(authClient, newCurriculum, folderName, childFolder);
            newCurriculumDocumentoURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    } 
    const body = {
        ...
        req.body, 
        curriculumDocumento: req.files && req.files['curriculumDocumento'] && req.files['curriculumDocumento'][0] ? newCurriculumDocumentoURL : req.body.curriculumDocumento,
        fotoPerfil: req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0] ?  newFotoDePerfilURL : req.body.fotoPerfil,
        contrasena: hash
    }
    if (!mongoose.Types.ObjectId.isValid(id)) { 
        return res.status(400).json({error: 'No existe ese miembro.'})
    }
    const miembro = await Miembro.findOneAndUpdate({_id: id}, {
        ...body
    })
    if (!miembro) {
        return res.status(400).json({error: 'No existe ese miembro.'})
    }
    res.status(200).json(miembro)   
}
const patchAllMiembros = async(req,res) => {
    const updateResult = await Miembro.updateMany(
        {}, 
        { $set: req.body } 
    );
    if (updateResult.nModified === 0) {
        return res.status(400).json({ error: 'No se encontraron documentos para actualizar.' });
    }
    res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
}
// Login
const loginUser = async(req,res) =>{
    const {
        correo,
        contrasena
        } = req.body
    try {
        const usuario = await Miembro.login(correo,contrasena);
        const token = createToken( usuario._id )
        res.status(200).json({ correo, token ,role_name: usuario.rolLaboratorio,user_id : usuario._id})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
// Sign Up 
const signUpUser = async(req,res) =>{
    const { 
        nombreCompleto,
        rolLaboratorio,
        correo,
        telefono,
        genero,
        areaEspecializacion,
        proyectosParticipacion,
        resumen,    
        fechaNacimiento,
        contrasena
    } = req.body
    try {

        if (nombreCompleto === ""){
            return res.status(400).json({error: "No se puede crear un miembro sin un nombre"})
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
        
        if (correo === ""){
            return res.status(400).json({error: "No se puede crear un miembro sin un correo electrónico válido."})
        }
        if (correo.length >= 40){
            return res.status(400).json({error: "El correo electrónico es muy largo. por favor usar un  correo electrónico más corto"})
        }
        if(!esEmailValido(correo)){
            return res.status(400).json({error: "El correo electrónico no tiene el formato correcto"})
        }

        if (telefono === ""){
            return res.status(400).json({error: "No se puede crear un miembro sin un número de teléfono válido."})
        }
        if (telefono.length >= 20){
            return res.status(400).json({error: "El número de teléfono es muy largo. por favor usar un número de teléfono más corto"})
        }
        if(!contieneSoloNumerosOSimbolos(telefono)){
            return res.status(400).json({error: "Los números de teléfono no pueden contener letras."})
        }

        let areaEspecializacionList = req.body.areaEspecializacion;
        if (typeof req.body.areaEspecializacion === 'string'){
            areaEspecializacionList = [req.body.areaEspecializacion]
        }
        if (!req.body.areaEspecializacion || req.body.areaEspecializacion.length === 0){
            return res.status(400).json({error: "Debe agregar mínimo un area de especialización."})
        }
        if (areaEspecializacionList.some((string) => {
            if (string === "") {
                res.status(400).json({ error: "No pueden ingresarse areas de especialización vacías." });
                return true;
            } else if (string.length >= 200) {
                res.status(400).json({ error: "Algún area de especialización agregada es muy larga. Por favor, usa un nombre de area de especialización más corto." });
                return true;
            } else if (string.length < 5) {
                res.status(400).json({ error: "Algún area de especialización agregada es muy corta. Por favor, usa un nombre de area de especialización más largo." });
                return true;
            }
        }));

        const authClient = await authorize();
        let fotoPerfilUrl = "";
        if ( req.files && req.files['fotoPerfil'] && req.files['fotoPerfil'][0]){
            const uploadedFile = req.files['fotoPerfil'][0];
            if (!['image/jpeg','image/png','image/jpg'].includes(uploadedFile.mimetype)){
                return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "fotos-de-perfil"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            fotoPerfilUrl = `https://drive.google.com/uc?id=${file['data'].id}`
        }
        let curriculumUrl = "";
        if ( req.files && req.files['curriculumDocumento'] &&  req.files['curriculumDocumento'][0]){
            const uploadedFile = req.files['curriculumDocumento'][0];
            if (uploadedFile.mimetype !== 'application/pdf'){
                return res.status(400).json({error: "Solamente se aceptan documentos pdf"})
            }
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder =  "curriculums"
            const file = await uploadFile(authClient, uploadedFile, folderName, childFolder);
            curriculumUrl = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
        const miembroNuevo = await Miembro.signup(
            nombreCompleto,
            rolLaboratorio,
            correo,
            telefono,
            genero,
            fotoPerfilUrl,
            areaEspecializacion,
            proyectosParticipacion,
            curriculumUrl,
            resumen,
            fechaNacimiento,
            contrasena,
          );
        const token = createToken(miembroNuevo._id)
        res.status(200).json({correo,rolLaboratorio, token})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
module.exports = {
    getMiembro,
    getAllMiembro,
    getAllMiembrosNames,
    deleteMiembro,
    patchAllMiembros,
    patchMiembro,
    loginUser,
    signUpUser
}