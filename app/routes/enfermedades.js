const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage');
const { 
    getEnfermedad,
    getAllEnfermedades,
    postEnfermedad,
    deleteEnfermedad,
    patchEnfermedad,
    patchEnfermedades
} = require('../controllers/enfermedadController')

const multiUpload = upload.fields([{name:"imagenes",maxCount:15},{name:"documento",maxCount:1}]);
// Routes
router.get('/enfermedades/:id',getEnfermedad);
router.get('/enfermedades',getAllEnfermedades);
router.post('/enfermedades', multiUpload,postEnfermedad);
router.delete('/enfermedades/:id',deleteEnfermedad); 
router.patch('/enfermedades/:id',multiUpload,patchEnfermedad)
router.patch('/enfermedades',patchEnfermedades)

module.exports = router;    