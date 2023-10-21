const express = require('express');
const router = express.Router();

const {
    getRol,
    getAllRoles,
    getRoleNames,
    postRol,
    deleteRol,
    patchRol,
} = require('../controllers/rolController');

// Routes
router.get('/roles/:id', getRol);
router.get('/roles', getAllRoles);
router.get('/names/roles',getRoleNames)
router.post('/roles', postRol);
router.delete('/roles/:id', deleteRol);
router.patch('/roles/:id', patchRol);

module.exports = router;