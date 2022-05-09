const express = require('express');
const ligaControler = require('../controllers/ligas.controller');
const md_autenticacion = require('../middlewares/autenticacion');


const api = express.Router();

//Funciones normales del usuario
api.post('/agregarLiga', md_autenticacion.Auth, ligaControler.agregarLiga);
api.put('/editarLiga/:idLiga', md_autenticacion.Auth, ligaControler.editarLiga);
api.delete('/eliminarLiga/:idLiga',md_autenticacion.Auth, ligaControler.eliminarLiga);
api.get('/obtenerLigas',md_autenticacion.Auth, ligaControler.obtenerLiga);

//Funciones de usuario de agregar al torneo y equipos
api.put('/agregarEquipos/:idLiga', md_autenticacion.Auth, ligaControler.agregarEquipos);
api.put('/agregarTorneoLiga/:idTorneo/:idLiga', md_autenticacion.Auth, ligaControler.agregarTorneoLiga);

module.exports = api;