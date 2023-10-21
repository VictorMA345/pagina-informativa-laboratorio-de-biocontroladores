const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage');
const {
    getTesis,
    getAllTesis,
    postTesis,
    deleteTesis,
    patchTesis,
    patchAllTesis   
} = require('../controllers/tesisController')
//routes

const multiUpload = upload.fields([{name: "imagenesExtras",maxCount:15},{name:"pathFotoTitulo",maxCount:1},{name:"pathArchivo",maxCount:1} ]);
router.get('/tesis/:id',getTesis)
router.get('/tesis',getAllTesis)
router.post('/tesis',multiUpload,postTesis)
router.delete('/tesis/:id',deleteTesis)  
router.patch('/tesis/:id',multiUpload,patchTesis)  
router.patch('/tesis',patchAllTesis)

module.exports = router;    