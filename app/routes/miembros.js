const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage')
const {
    getMiembro,
    getAllMiembro,
    getAllMiembrosNames,
    deleteMiembro,
    patchAllMiembros,
    patchMiembro,
    signUpUser,
    loginUser
} = require('../controllers/miembrosController')

const multiUpload = upload.fields([{name: "fotoPerfil",maxCount:1},{name:"curriculumDocumento",maxCount:1}])

//routes
router.get('/miembros/:id',getMiembro);
router.get('/miembros',getAllMiembro);
router.get('/names/miembros',getAllMiembrosNames)
router.post('/miembros/login',loginUser)
router.post('/miembros/signup',multiUpload,signUpUser)
router.delete('/miembros/:id',deleteMiembro)  
router.patch('/miembros/:id',multiUpload,patchMiembro)  
router.patch('/miembros',patchAllMiembros)
module.exports = router;    