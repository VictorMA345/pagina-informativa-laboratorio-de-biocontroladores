const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage')
const {
    getNoticias,
    getAllNoticias,
    postNoticias,
    deleteNoticias,
    patchNoticias,
    patchAllNoticias
} = require('../controllers/noticiasController')
const multiUpload = upload.fields([{name:"documentoComplementario",maxCount:1},{name: "imagenes",maxCount:15}]);
// Routes
router.get('/noticias/:id',getNoticias);
router.get('/noticias',getAllNoticias);
router.post('/noticias',multiUpload,postNoticias);
router.delete('/noticias/:id',deleteNoticias)  
router.patch('/noticias/:id',multiUpload,patchNoticias)  
router.patch('/noticias',patchAllNoticias)


module.exports = router;    