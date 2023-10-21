const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage')

const {
    getColaborador,
    getAllColaboradores,
    postColaborador,
    deleteColaborador,
    patchColaborador,
    patchAllColaboradores
} = require('../controllers/colaboradorController');

const multiUpload = upload.fields([{name: "fotoPerfil",maxCount:1}])
// Routes
router.get('/colaboradores/:id',getColaborador)
router.get('/colaboradores', getAllColaboradores)
router.post('/colaboradores', multiUpload ,postColaborador)
router.delete('/colaboradores/:id',deleteColaborador)  
router.patch('/colaboradores/:id',multiUpload,patchColaborador)
router.patch('/colaboradores',patchAllColaboradores)

module.exports = router;    