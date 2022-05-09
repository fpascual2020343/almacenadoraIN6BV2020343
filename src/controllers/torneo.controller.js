const Torneo = require('../models/torneo.model')

function agregarTorneo(req, res) {

    const rol = req.user.rol;
    const modeloTorneo = new Torneo();
    const parametros = req.body;

    if (rol == 'Admin') {

        modeloTorneo.nombre = parametros.nombre;
        modeloTorneo.descripcion = parametros.descripcion;

        modeloTorneo.save((err, torneoGuardado) => {
            
            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticionn' })
            if (!torneoGuardado) return res.status(404).send({ mensaje: 'Hubo un error al agregar el torneo' })
            return res.status(200).send({torneo: torneoGuardado})

        })

    } else {
        return res.status(500).send({ mensaje: 'Solo los administradores pueden agregar torneos' })
    }

}

function editarTorneo(req, res) {

    const idTorneo = req.params.idTorneo;
    const rol = req.user.rol;
    const parametros = req.body;

    if (rol == 'Admin') {

        Torneo.findByIdAndUpdate(idTorneo, parametros, { new: true }, (err, torneoEditado) => {

            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
            if (!torneoEditado) return res.status(404).send({ mensaje: 'Hubo un error al editar el torneo' })

            return res.status(200).send({ torneo: torneoEditado })

        })

    } else {

        return res.status(500).send({ mensaje: 'Solo los administradores pueden editar un torneo' })
    }

}

function eliminarTorneo(req, res) {

    const rol = req.user.rol;
    const idTorneo = req.params.idTorneo;

    if (rol == 'Admin') {
        Torneo.findByIdAndDelete({ _id: idTorneo }, (err, usuarioEliminada) => {
            
            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' });
            if (!usuarioEliminada) return res.status(500).send({ mensaje: 'Hubo un error al eliminar el torneo' });

            return res.status(200).send({ usuario: usuarioEliminada })
        })
    }
}

function obtenerTorneo(req, res) {

    const rol = req.user.rol;

    if (rol == 'Admin') {
        Torneo.find({}, (err, torneosEncontrados) => {

            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
            if (!torneosEncontrados) return res.status(404).send({ mensake: 'Hubo un error al obtener los torneos' })
            return res.status(200).send({ torneos: torneosEncontrados })

        })

    } else {
        return res.status(500).send({ mensaje: 'Solo los administradores pueden obtener los torneos' })
    }
}

module.exports = {
    agregarTorneo,
    editarTorneo,
    eliminarTorneo,
    obtenerTorneo
}