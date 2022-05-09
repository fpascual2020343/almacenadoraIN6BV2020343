const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/login', usuarioControlador.Login);
api.post('/agregarAdministrador', md_autenticacion.Auth ,usuarioControlador.agregarAdministrador);
api.put('/editarUsuario/:idUsuario', md_autenticacion.Auth ,usuarioControlador.editarUsuario);
api.post('/registrar',usuarioControlador.registrarUsuario);
api.delete('/eliminarUsuario/:idUsuario',md_autenticacion.Auth ,usuarioControlador.eliminarUsuario);



module.exports = api;