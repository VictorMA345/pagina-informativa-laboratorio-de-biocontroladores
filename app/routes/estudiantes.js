const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage')
const {
    getEstudiante,
    getAllEstudiantes,
    getAllEstudiantesNames,
    postEstudiantes,
    deleteEstudiante,
    patchEstudiantes,
    patchAllEstudiantes
} = require('../controllers/estudiantesController');
const multiUpload = upload.fields([{name: "fotoPerfil",maxCount:1,},{name: "curriculum",maxCount:1}])
//routes
router.get('/estudiantes/:id',getEstudiante)
router.get('/estudiantes',getAllEstudiantes)
router.get('/names/estudiantes',getAllEstudiantesNames)
router.post('/estudiantes',multiUpload,postEstudiantes)
router.delete('/estudiantes/:id',deleteEstudiante)  
router.patch('/estudiantes/:id',multiUpload,patchEstudiantes)
router.patch('/estudiantes',patchAllEstudiantes)

module.exports = router;    