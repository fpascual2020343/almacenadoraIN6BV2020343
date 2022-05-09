const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRoutes = require('./src/routes/usuario.routes');
const TorneoRoutes = require('./src/routes/torneo.routes');
const LigasRoutes = require('./src/routes/ligas.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRoutes, TorneoRoutes, LigasRoutes);

module.exports = app;

