const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LigaSchema = Schema({
    nombre: String,
    descripcion: String,
    equipos: [{
        nombreEquipo: String, 
        ciudad: String, 
        nombreCampo: String, 
        posicion: String
    }],
    idTorneo: {type : Schema.Types.ObjectId, ref:'Torneos'},
    idUsuario: {type: Schema.Types.ObjectId, ref:'Usuarios'}
});

module.exports = mongoose.model('Ligas', LigaSchema);