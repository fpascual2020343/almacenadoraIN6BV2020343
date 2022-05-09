const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function UsuarioDefault(req, res) {
    var modeloUsuario = new Usuario();
    Usuario.find({ email: "Administrador@gmail.com", nombre: "Admin" }, (err, usuarioEncontrado) => {
        if (usuarioEncontrado.length > 0) {
            console.log({ mensaje: "ya se ha creado el usuario del Administrador" })
        } else {

            modeloUsuario.nombre = "Admin";
            modeloUsuario.email = "Administrador@gmail.com";
            modeloUsuario.password = "deportes123";
            modeloUsuario.rol = "Admin";

            bcrypt.hash(modeloUsuario.password, null, null, (err, passwordEncryptada) => {

                modeloUsuario.password = passwordEncryptada
                modeloUsuario.save((err, usuarioGuardado) => {
                    if (err) console.log({ mensaje: 'error en la peticion ' })
                    if (!usuarioGuardado) console.log({ mensaje: 'error al crear usuario por defecto ' })
                    console.log({ Usuario: usuarioGuardado })

                })
            })
        }
    })

}

function Login(req, res) {
    var parametros = req.body;

    Usuario.findOne({ nombre : parametros.nombre }, (err, usuarioEncontrado) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if (usuarioEncontrado){

            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({token: jwt.crearToken(usuarioEncontrado)})
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La contrasena no coincide.'})
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'El nombre, no se ha podido identificar'})
        }
    })
}

function agregarAdministrador(req, res) {
    const modeloUsuario = new Usuario();
    const parametros = req.body

    Usuario.find({ email: parametros.email }, (err, existente1) => {

        if (existente1.length > 0) {

            return res.status(200).send({ mensaje: "Este correo ya esta en uso" })

        } else {
            
            if (req.user.rol == 'Admin') {

                modeloUsuario.nombre = parametros.nombre;
                modeloUsuario.email = parametros.email;
                modeloUsuario.rol = 'Admin'
                
                bcrypt.hash(parametros.password, null, null, (err, passwordEncryptada) => {
                    modeloUsuario.password = passwordEncryptada
                    modeloUsuario.save((err, usuarioGuardado) => {
                        if (err) res.status(500).send({ mensaje: 'error en la peticion ' })
                        if (!usuarioGuardado) res.status(404).send({ mensaje: 'error al crear usuario por defecto ' })
                        return res.status(200).send({ Usuario: usuarioGuardado })
        
                    })
                })
            }

        }
    })

}

function editarUsuario(req, res) {

    const parametros = req.body;
    const idUsuario = req.params.idUsuario;

    if (req.user.rol == 'Admin') {

        Usuario.findOne({ _id: idUsuario }, (err, usuarioEncontrado) => {

            if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
            if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })

            if (usuarioEncontrado.rol == 'Admin') {
                return res.status(500).send({ mensaje: 'No puede editar a los usuarios con un rol de administrador' })
            } else {
                Usuario.findByIdAndUpdate(idUsuario, parametros, { new: true }, (err, usuarioActualizado) => {
                    if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
                    if (!usuarioActualizado) return res.status(400).send({ mensaje: 'Hubo un error al actualizar en usuario' })

                    return res.status(200).send({ usuario: usuarioActualizado })

                })
            }

        })

    } else {
        return res.status(500).send({ mensaje: 'Solo los administradores pueden editar los usuarios' })
    }

}

function registrarUsuario(req, res) {
    const modeloUsuario = new Usuario();
    const parametros = req.body

    Usuario.find({ email: parametros.email }, (err, existente1) => {

        if (existente1.length > 0) {

            return res.status(200).send({ mensaje: "Este correo ya esta en uso" })

        } else { 

            if (parametros.nombre && parametros.password) {

                modeloUsuario.nombre = parametros.nombre;
                modeloUsuario.email = parametros.email;
                modeloUsuario.rol = 'Usuario'
        
                bcrypt.hash(parametros.password, null, null, (err, passwordEncryptada) => {
                    modeloUsuario.password = passwordEncryptada
                    modeloUsuario.save((err, usuarioGuardado) => {
                        if (err) res.status(500).send({ mensaje: 'error en la peticion ' })
                        if (!usuarioGuardado) res.status(404).send({ mensaje: 'error al crear usuario por defecto ' })
                        return res.status(200).send({ Usuario: usuarioGuardado })
        
                    })
                })
            } else {
                return res.status(500).send({ mensaje: 'Debe enviar los parametros obligatorios' })
            }

        }
    })


}

function eliminarUsuario(req, res) {
    const idUsuario = req.params.idUsuario;

    Usuario.findOne({ _id: idUsuario }, (err, usuarioEncontrado) => {

        if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })
        if (!usuarioEncontrado) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' })

        if (usuarioEncontrado.rol == 'Admin') {
            return res.status(500).send({ mensaje: 'No puede eliminar a los usuarios con un rol de administrador' })
        } else {

            Usuario.findByIdAndDelete({ _id: idUsuario }, (err, usuarioEliminada) => {
                if (err) return res.status(500).send({ mensaje: 'Hubo un error en la peticion' });
                if (!usuarioEliminada) return res.status(500).send({ mensaje: 'Hubo un error al eliminar la empresa' });

                return res.status(200).send({ usuario: usuarioEliminada })
            })
        }

    })

}

module.exports = {
    UsuarioDefault,
    Login,
    agregarAdministrador,
    editarUsuario,
    registrarUsuario,
    eliminarUsuario
}