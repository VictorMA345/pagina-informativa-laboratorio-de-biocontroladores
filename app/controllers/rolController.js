const Rol = require('../models/rolModel');
const Miembro = require('../models/miembrosModel')
const mongoose = require('mongoose');
// Get Methods
const getRol = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) { 
    return res.status(404).json({ error: 'No existe ese rol.' });
  }

  try {
    const rol = await Rol.findById(id);
    if (!rol) {
      return res.status(404).json({ error: 'No existe ese rol.' });
    }
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el rol.' });
  }
};

const getAllRoles = async (req, res) => {
  const orden = req.query.orden || 'desc';
  const resultadoBusqueda = req.query.busqueda || '';
  const clavePorBuscar = req.query.clave || '';
  const ordenacion = {};
  const busqueda = {};
  if (clavePorBuscar !== '') {
    if (orden === 'asc') {
      ordenacion[clavePorBuscar] = 1;
    } else {
      ordenacion[clavePorBuscar] = -1;
    }
  }
  if (resultadoBusqueda !== '' && clavePorBuscar !== '') {
    busqueda[clavePorBuscar] = { $regex: new RegExp(resultadoBusqueda, 'i') };
  }
  let pagina = parseInt(req.query.pagina) || 1
  let cantidad =  parseInt(req.query.cantidad) || 10
  const skipAmount = (pagina - 1) * cantidad; 
  const roles = await Rol.find(busqueda)
  .sort(ordenacion)
  .limit(cantidad)
  .skip(skipAmount);
  if (!roles || roles.length === 0) {
    return res.status(404).json({ error: 'No se encontraron roles.' });
  }
  const RolCount = await Rol.count()
  const data = {
      data: roles,
      itemCounts: RolCount
  }
  res.status(200).json(data);
};

const getRoleNames = async (req, res) => {
  try {
    const roles = await Rol.find({}, 'role_name _id'); 
    if (!roles || roles.length === 0) {
      return res.status(404).json({ error: 'No se encontraron roles.' });
    }
    const roleNames = roles.map(role => ({
      id: role._id,
      role_name: role.role_name,
    }));  
    res.status(200).json(roleNames);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los nombres de los roles.' });
  }
};
// Post Method
const postRol = async (req, res) => {
  const { role_name, descripcion, general_permissions, permissions } = req.body;
  if (role_name === ""){
    return res.status(400).json({error: "No se puede crear un rol sin un nombre"})
  }
  if (role_name.length >= 150){
    return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
  }
  const contieneNumeros = /\d/.test(role_name);
  const contieneSimbolos = /[^A-Za-z0-9\s]/.test(role_name);
  if (contieneNumeros || contieneSimbolos){
    return res.status(400).json({error: "El nombre no puede contener símbolos o número."})
  }

  try {
    const nuevoRol = await Rol.create({
      role_name: role_name,
      descripcion: descripcion,
      general_permissions: general_permissions,
      permissions :permissions,
    });

    res.status(200).json(nuevoRol);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Method
const deleteRol = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No existe ese rol.' });
  }

  let rol = await Rol.findOne({ _id: id })
  if (rol.role_name === "Administrador"){
    return res.status(400).json({ error: 'No se puede eliminar el rol del administrador' });
  }
  
  const miembrosConEsteRol = await Miembro.find({ rolLaboratorio: id });

  if (miembrosConEsteRol.length > 0) {
    return res.status(400).json({ error: 'No se puede eliminar este rol, hay miembros asignados a él.' });
  }

  try { 
    const rol = await Rol.findOneAndDelete({ _id: id });
    if (!rol) {
      return res.status(400).json({ error: 'No existe ese rol.' });
    }
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el rol.' });
  }
};

// Patch Method
const patchRol = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'No existe ese rol.' });
  }

  try {
    let Verificationrol = await Rol.findOne({ _id: id })
    if (Verificationrol.role_name === "Administrador"){
      return res.status(400).json({ error: 'No se puede editar el rol del administrador' });
    }
    
    if (req.body.role_name === ""){
      return res.status(400).json({error: "No se puede crear un rol sin un nombre"})
    }
    if (req.body.role_name.length >= 150){
      return res.status(400).json({error: "El nombre es muy largo. por favor usar un nombre más corto"})
    }
    const contieneSimbolos = /[^A-Za-z0-9\s]/.test(req.body.role_name);
    if (contieneSimbolos){
      return res.status(400).json({error: "El nombre no puede contener símbolos o número."})
    }
    const rol = await Rol.findOneAndUpdate({ _id: id }, { ...req.body });
    if (!rol) {
      return res.status(400).json({ error: 'No existe ese rol.' });
    }
    res.status(200).json(rol);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el rol.' });
  }
};

module.exports = {
  getRol,
  getAllRoles,
  getRoleNames,
  postRol,
  deleteRol,
  patchRol,
};
