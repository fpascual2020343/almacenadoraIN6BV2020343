const express = require('express');
const cors = require('cors');
var app = express();

const UsuarioRutas = require('./src/routes/usuario.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', UsuarioRutas);
<<<<<<< Updated upstream
module.exports = app;
=======
module.exports = app;
>>>>>>> Stashed changes
