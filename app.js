const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuario.routes');
const LigaRutas = require('./src/routes/liga.routes')
const Torneoroutes = require('./src/routes/torneo.routes')
const ResultadosRoutes = require('./src/routes/resultado.routes')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas, LigaRutas, Torneoroutes, ResultadosRoutes);
module.exports = app;