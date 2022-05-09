const express = require('express');
const torneoControler = require('../controllers/torneo.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarTorneo', md_autenticacion.Auth, torneoControler.agregarTorneo);
api.put('/editarTorneo/:idTorneo', md_autenticacion.Auth, torneoControler.editarTorneo);
api.get('/obtenerTorneos',md_autenticacion.Auth, torneoControler.obtenerTorneo);
api.delete('/eliminarTorneo/:idTorneo',md_autenticacion.Auth, torneoControler.eliminarTorneo);

module.exports = api;