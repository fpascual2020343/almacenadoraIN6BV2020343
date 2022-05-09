const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TorneoSchema = Schema({
    nombre: String,
    descripcion: String,
});

module.exports = mongoose.model('Torneos', TorneoSchema);