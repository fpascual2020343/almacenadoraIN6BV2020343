const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function UsuarioDefault(req, res) {

    var modeloUsuario = new Usuario();

    Usuario.find({ email: "admin@gmail.com" }, (err, existente) => {

        if (existente.length > 0) {
            console.log("El  admin ya esta registrado");
        } else {

            modeloUsuario.nombre = "ADMIN";
            modeloUsuario.email = "admin@gmail.com";
            modeloUsuario.password = "deportes123";
            modeloUsuario.rol = "Admin";

            bcrypt.hash('deportes123', null, null, (err, passwordEncriptada) => {

                modeloUsuario.password = passwordEncriptada;

                modeloUsuario.save((err, usuarioGuardado) => {

                    if (err) console.log("Error en la peticion")
                    if (!usuarioGuardado) console.log("Error al guardar el admin");

                    console.log({ Usuario: usuarioGuardado });
                })
            })
        }

    })

}

function Login(req, res) {

    var parametros = req.body;

    Usuario.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {

            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        return res.status(200)
                            .send({ token: jwt.crearToken(usuarioEncontrado) })
                    } else {
                        return res.status(500).send({ mensaje: 'La contrasena no coincide.' })
                    }
                })
        } else {
            return res.status(500).send({ mensaje: 'El usuario, no se ha podido identificar' })
        }
    })
}


function agregarUsuario(req, res) {

    var parametros = req.body;
    var modeloUsuarios = new Usuario();

    Usuario.find({ email: parametros.email }, (err, existente1) => {

        if (existente1.length > 0) {

            return res.status(200).send({ mensaje: "Este correo ya esta en uso" })

        } else {

            if (parametros.nombre && parametros.email && parametros.rol) {

                modeloUsuarios.nombre = parametros.nombre;
                modeloUsuarios.email = parametros.email;
                modeloUsuarios.rol = parametros.rol;

                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {

                    modeloUsuarios.password = passwordEncriptada;

                    modeloUsuarios.save((err, usuarioGuardado) => {

                        if (err) return res.status(404).send({ mensaje: "Error en la peticion" })
                        if (!usuarioGuardado) return res.status(404).send({ mensaje: "Error al guardar al usuario" });

                        return res.status(200).send({ Usuario: usuarioGuardado });
                    })
                })

            } else {
                return res.status(400).send({ mensaje: "Debe de agregar los parametros Obligatorios" });
            }

        }

    })

}

function editarUsuario(req, res) {

    var idUser = req.params.idUsuario;
    var parametros = req.body;

    //Borrar la propiedad de password y el rol en el body
    delete parametros.rol;
    delete parametros.password;

    if(req.user.sub !== idUser) {

        return res.status(500).send({ mensaje: "No tiene los permisos para editar un usuario que no es el suyo"});
    
    }
    
    Usuario.findByIdAndUpdate(req.user.sub, parametros, {new: true}, (err, usuarioEditado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuarioEditado) return res.status(500).send({ mensaje: "Error al editar el Usuario"});

        return res.status(200).send({usuario: usuarioEditado});

    })

}

function eliminarUsuario(req, res) {

    var idUser = req.params.idUsuario;

    if(req.user.sub !== idUser) {

        return res.status(500).send({ mensaje: "No tiene los permisos para eliminar un usuario que no es el suyo"});
    
    }
    
    Usuario.findByIdAndDelete(req.user.sub, (err, usuarioEliminado)=>{

        if(err) return res.status(500).send({ mensaje: 'Error en  la peticion'});
        if(!usuarioEliminado) return res.status(500).send({ mensaje: "Error al eliminar el Usuario"});

        return res.status(200).send({usuario: usuarioEliminado});

    })

}



module.exports = {
    UsuarioDefault,
    Login,
    agregarUsuario,
    editarUsuario,
    eliminarUsuario
}