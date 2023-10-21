const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage.js');
const {
    getControlBiologico,
    getAllControlBiologico,
    postControlBiologico,
    deleteControlBiologico,
    patchControlBiologico,
    patchAllControlBiologico
} = require('../controllers/control_biologicoController')


const multiUpload = upload.fields([{name:"imagenes",maxCount:15},{name:"documentoDetallado",maxCount:1}])
// Routes
router.get('/control_biologico/:id',getControlBiologico)
router.get('/control_biologico', getAllControlBiologico)
router.post('/control_biologico',multiUpload,postControlBiologico)
router.delete('/control_biologico/:id',deleteControlBiologico)  
router.patch('/control_biologico/:id',multiUpload,patchControlBiologico)
router.patch('/control_biologico',patchAllControlBiologico)

module.exports = router;    