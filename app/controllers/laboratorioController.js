const Laboratorio = require('../models/laboratorioModel');
const { authorize, uploadFile,deleteFileFromDrive,replaceFileInDrive,esURLGoogleDriveValida } = require('../storageMethods');
const getLaboratorio = async(req,res) => {
    const lab = await Laboratorio.find()
    res.status(200).json(lab)
}
const patchLaboratorio = async(req,res) => {
    console.log(req.files)
    const authClient = await authorize();
    const labAntiguo = await Laboratorio.findById("653f04433d9776c009a06f6c");
    let newimagenPrincipalURL = "";
    if (req.files && req.files['imagenPrincipal'] && req.files['imagenPrincipal'][0]) {
        const newimagenPrincipal = req.files['imagenPrincipal'][0];
        if (!['image/jpeg','image/png','image/jpg'].includes(newimagenPrincipal.mimetype)){
            return res.status(400).json({error: "Solamente se aceptan imagenes en formato .jpeg, .jpg o .png"})
        }
        if (labAntiguo.imagenPrincipal  && esURLGoogleDriveValida(labAntiguo.imagenPrincipal)) {
            newimagenPrincipalURL = await replaceFileInDrive(authClient, newimagenPrincipal, labAntiguo.imagenPrincipal, "fotos-estudiantes");
            newimagenPrincipalURL = `https://drive.google.com/uc?id=${newimagenPrincipalURL}`;
        } else {
            const folderName = process.env.GOOGLE_DRIVE_FOLDER_NAME;
            const childFolder = "foto-principal";
            const file = await uploadFile(authClient, newimagenPrincipal, folderName, childFolder);
            newimagenPrincipalURL = `https://drive.google.com/uc?id=${file['data'].id}`;
        }
    } else {
        if (labAntiguo.imagenPrincipal  && req.body.imagenPrincipal !== labAntiguo.imagenPrincipal && esURLGoogleDriveValida(labAntiguo.imagenPrincipal) ) 
        {
            await deleteFileFromDrive(authClient,labAntiguo.imagenPrincipal);
        }
    }
    const body = {
        ...req.body,
        imagenPrincipal: req.files && req.files['imagenPrincipal'] && req.files['imagenPrincipal'][0] ? newimagenPrincipalURL : req.body.imagenPrincipal,
    };
    await Laboratorio.findOneAndUpdate({ _id: "653f04433d9776c009a06f6c"}, {
        ...body
    });
    res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
}

const increaseView = async(req,res) => {
    try {
        await Laboratorio.findOneAndUpdate(
            {_id : "653f04433d9776c009a06f6c"},
            { $inc: { visitas: 1 } });  
        res.status(200).json({ message: 'Documentos actualizados exitosamente.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar documentos.' });
    }
}

module.exports = {
    getLaboratorio,
    patchLaboratorio,
    increaseView
}