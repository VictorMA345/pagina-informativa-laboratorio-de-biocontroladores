const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage');
const {
    getServicio,
    getAllServicio,
    postServicio,
    deleteServicio,
    patchServicio,
    patchAllServicio
} = require('../controllers/serviciosController')

const multiUpload = upload.fields([{name: "fotosServicio",maxCount:15}]);
//routes

router.get('/servicios/:id',getServicio)
router.get('/servicios',getAllServicio)
router.post('/servicios',multiUpload,postServicio)
router.delete('/servicios/:id',deleteServicio)  
router.patch('/servicios/:id',multiUpload,patchServicio)
router.patch('/servicios',patchAllServicio)

module.exports = router;    