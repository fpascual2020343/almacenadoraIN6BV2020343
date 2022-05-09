const Liga = require('../models/ligas.model')

function agregarLiga(req, res) {

    const rol = req.user.rol;
    const modeloLiga = new Liga();
    const parametros = req.body;

    if (rol == 'Usuario') {

        modeloLiga.nombre = parametros.nombre;
        modeloLiga.descripcion = parametros.descripcion;
        modeloLiga.idTorneo = null;
        modeloLiga.idUsuario = req.user.sub;

        modeloLiga.save((err, LigaGuardado) => {

            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticionn' });
            if (!LigaGuardado) return res.status(404).send({ mensaje: 'Hubo un error al agregar la liga' });

            return res.status(200).send({ ligas: LigaGuardado })

        })

    } else {
        return res.status(500).send({ mensaje: 'Solo los usuarios pueden agregar ligas'});
    }
}

function editarLiga(req, res) {

    const idLiga = req.params.idLiga;
    const rol = req.user.rol;
    const parametros = req.body;

    if (rol == 'Usuario') {

        Liga.findOne({ idUsuario: req.user.sub, _id: idLiga }, (err, ligaEncontrada) => {

            if (ligaEncontrada) {

                Liga.findByIdAndUpdate(ligaEncontrada._id, parametros, { new: true }, (err, ligaEditada) => {

                    if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
                    if (!ligaEditada) return res.status(404).send({ mensaje: 'Hubo un error al editar la liga' })

                    return res.status(200).send({ liga: ligaEditada })
                })
            } else {
                return res.status(500).send({ mensaje: 'No puede editar una liga que no le corresponde' })
            }

        })
    } else {
        return res.status(500).send({ mensaje: 'Solo los usuarios pueden editar una liga' })
    }

}

function eliminarLiga(req, res) {

    const rol = req.user.rol;
    const idLiga = req.params.idLiga;

    if (rol == "Usuario") {

        Liga.findOne({ idUsuario: req.user.sub, _id: idLiga }, (err, ligaEncontrada) => {

            if (ligaEncontrada) {
                Liga.findByIdAndDelete({ _id: idLiga }, (err, ligaEliminada) => {

                    if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' });
                    if (!ligaEliminada) return res.status(500).send({ mensaje: 'Hubo un error al eliminar la liga' });
    
                    return res.status(200).send({ usuario: ligaEliminada })
                })
            } else {
                return res.status(500).send({ mensaje: 'No puede eliminar una liga que no le corresponde' })
            }
    
        })
    } else {
        return res.status(500).send({ mensaje: 'Solo los usuarios pueden eliminar una liga' })
    }

}

function obtenerLiga(req, res) {

    const rol = req.user.rol;

    if(rol == "Usuario"){
        Liga.find({ idUsuario: req.user.sub }, (err, ligaEncontrados) => {

            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
            if (!ligaEncontrados) return res.status(404).send({ mensake: 'Hubo un error al obtener las ligas' })

            return res.status(200).send({ liga: ligaEncontrados })
    
        })
    } else {
        return res.status(500).send({ mensaje: 'Solo los usuarios pueden obtener las ligas' })
    }

}

function agregarEquipos(req, res) {
    
    const parametros = req.body;
    const idLiga = req.params.idLiga;
    const idUsuario = req.user.sub;
    const rol = req.user.rol;

    if (rol == 'Usuario') {

        Liga.find({idUsuario: req.user.sub, _id: idLiga }, (err, ligaEncontrada) => {

            if(ligaEncontrada == '') return res.status(500).send({mensaje: 'No puede agregar equipos a una liga que no le pertenece'});

            if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'});
            if(!ligaEncontrada) return res.status(404).send({mensaje: 'No puede agregar equipos a una liga que no le pertenece'});

            if (ligaEncontrada) {

                Liga.findOne({ _id: idLiga }, (err, ligaEncontrada) => {

                    if(err) return res.status(500).send({mensaje: 'Hubo un error en la peticion'})
                    if(!ligaEncontrada) return res.status(404).send({mensaje: 'Hubo un error al encontrar la liga'})

                    if (ligaEncontrada.equipos.length != 10) {

                        Liga.findByIdAndUpdate(idLiga, { $push: { equipos: { nombreEquipo: parametros.nombre, ciudad: parametros.ciudad, 
                                                                                nombreCampo: parametros.nombreCampo, posicion: parametros.posicion } } }, 
                                                                                    { new: true }, (err, equipoAgregado) => {

                            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
                            if (!equipoAgregado) return res.status(500).send({ mensaje: 'Hubo un error al agregar el equipo' })

                            return res.status(200).send({ equipo: equipoAgregado })
                        })
                    } else {
                        return res.status(500).send({ mensaje: 'El limite es de 10 equipos' })
                    }

                })
            } else {
                return res.status(500).send({ mensaje: 'No puede agregar a una liga que no le pertenece' })
            }
        })
    }

}

function agregarTorneoLiga(req, res) {
    const idTorneo = req.params.idTorneo;
    const idLiga = req.params.idLiga;

    if (req.user.rol == 'Usuario') {
        Liga.find({ _id: idLiga, idUsuario: req.user.sub }, (err, ligaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Hubo un erroe en la peticion' })
            if (!ligaEncontrada) return res.status(404).send('Hubo un error al buscar la liga')

            if (ligaEncontrada) {
                Liga.findByIdAndUpdate(idLiga, { idTorneo: idTorneo }, { new: true }, (err, ligaActualizada) => {
                    if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
                    return res.status(200).send({ liga: ligaActualizada })

                })
            }
        })
    }
}

module.exports = {
    agregarLiga,
    editarLiga,
    eliminarLiga,
    obtenerLiga,
    agregarTorneoLiga,
    agregarEquipos
}