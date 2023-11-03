const express = require('express');
const router = express.Router();
const { upload } = require('../appStorage')
const {
    patchLaboratorio,
    getLaboratorio,
    increaseView
} = require('../controllers/laboratorioController');
const multiUpload = upload.fields([{name: "imagenPrincipal",maxCount:1,}])
router.get('/informacion',getLaboratorio)
router.get('/informacion/increase-view',increaseView);
router.patch('/informacion',multiUpload,patchLaboratorio)

module.exports = router;    