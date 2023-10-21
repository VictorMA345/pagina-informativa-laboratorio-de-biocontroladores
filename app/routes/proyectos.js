const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage')
const {
    getProyectos,
    getAllProyectos,
    getAllProjectNames,
    postProyectos,
    deleteProyectos,
    patchProyectos,
    patchAllProyectos
} = require('../controllers/proyectosController');


const multiUpload = upload.fields([{name:"documentos",maxCount:1},{name: "imagenes",maxCount:15}]);
// Routes
router.get('/proyectos/:id',getProyectos);
router.get('/proyectos',getAllProyectos);
router.get('/names/proyectos',getAllProjectNames)
router.post('/proyectos',multiUpload,postProyectos)
router.delete('/proyectos/:id',deleteProyectos)  
router.patch('/proyectos/:id',multiUpload,patchProyectos)  
router.patch('/proyectos',patchAllProyectos)

module.exports = router;    