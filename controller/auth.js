'use strict'

const User = require('../models/user')
const service = require('../services/index')
var Article = require('../models/article');
var f = true;
var controlemai = true;

function signUp(req, res) {

    var params = req.body;
    if(params.nombre=="" || params.apellido ==""|| params.email ==""|| params.password==""){
        return res.status(500).send({ message: `Error al crear el usuario` })
    }
    const user = new User({
        nombre: params.nombre,
        apellido: params.apellido,
        direccion: params.direccion,
        telefono: params.telefono,
        email: params.email,
        dni: params.dni,
        password: params.password,
        rol:params.rol
    })
    console.log(user);
    var query = User.find({ email: req.body.email });

    //Find sacar los datos de la bd
    query.sort('-email').exec((err, USER) => {

        if (USER.length == 0) {
            controlemai=false;
            user.save((err) => {
                if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })
    
                return res.status(201).send({ token: service.createTokenRegistre(user) })
            })
        } else {
            controlemai=true;
            return res.status(200).send({
                status: 'error',
                message: 'existee!!',

            })
        }
    });


    if (controlemai == false) {
        user.save((err) => {
            if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

            return res.status(201).send({ token: service.createToken(user) })
        })
    }

}

function getsesiones(req, res) {

    var query = User.find({ email: req.body.email });

    //Find sacar los datos de la bd
    query.sort('-email').exec((err, user) => {

        if (user.length == 0) {
            return res.status(404).send({
                status: 'error',
                message: 'No hay sesiones!!',

            })
        } else {
            return res.status(200).send({
                status: 'success',
                message: 'Ese Usuario ya existe, prueba con otro',

            })
        }
    });


}


 //EDITAR USER

 function update (req, res){
console.log("entraaa")
    //Recoger el ID del articulo por la URL

    var clienteId = req.params.id;


    //Regoger los datos que llegan por put 
    var params = req.body;
console.log(params.nombre+"nombre"+params.apellido,params.dni,params.direccion)
    //Validar datos

    try {
        var validate_nombre = params.nombre;
        var validate_apellido = params.apellido;
        var validate_dni = params.dni;
        var validate_direccion = params.direccion;
        var validate_rol = params.rol;
        //var precio=  !validator.isEmpty(params.precio);
console.log(params.nombre)
    } catch (err) {

        return res.status(500).send({
            status: 'error',
            message: err
        });

    }

    if (validate_nombre && validate_apellido && validate_dni && validate_direccion && validate_rol ) {
        //Find and Update
        console.log("entraa" + clienteId);
        User.findOneAndUpdate({ _id: clienteId }, params, { new: true }, (err, clienteUpdate) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar'
                });
            }


            if (!clienteUpdate) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                cliente: clienteUpdate
            });

        });
    } else {
        return res.status(200).send({
            status: 'error',
            message: 'La validación no es correcta'
        });
    }


}
function signIn(req, res) {

   console.log("ENTRA EN LOGIN")
    console.log(req.body.email)

    console.log(req.body.password)
    var query = User.find({ email: req.body.email });
    var querypass = User.find({ password: req.body.password });

    console.log(f = false)
    querypass.exec((err, pass) => {
        if (err) {
            f = false
            return res.status(500).send({
                status: 'error',
                message: 'Error  en la contraseña!!',

            })
        } else if (pass.length == 0) {
            f = false
            return res.status(404).send({
                status: 'error',
                message: 'No existe esa contraseña!!',

            })
        } else {
            f = true;
            query.sort('-email').exec((err, user) => {
                console.log(req.body.email);
                if (err) {

                    return res.status(500).send({
                        status: 'error',
                        message: 'Error  al  las sesiones!!',

                    })
                }
                if (user.length == 0) {

                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay sesiones!!',

                    })
                }



                req.user = user
console.log(user);
                return res.status(200).send({

                    message: 'Te has logueado correctamente',
                    token: service.createToken(user)


                })


            })
        }


    })
 
}




module.exports = {
    signUp,
    signIn, getsesiones, update
}