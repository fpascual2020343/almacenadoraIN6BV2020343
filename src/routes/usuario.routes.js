const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/login', usuarioControlador.Login);
api.post('/agregarUsuario', md_autenticacion.Auth, usuarioControlador.agregarUsuario);

module.exports = api;